#!/usr/bin/env python3
"""
extract_class.py — Extractor potente de HTML + CSS + imágenes para una clase CSS.

Uso:
    python extract_class.py <URL> <CLASE> [--out CARPETA] [--render]

Ejemplos:
    python extract_class.py https://misitio.framer.app framer-Zfc2C
    python extract_class.py https://misitio.framer.app framer-Zfc2C --out salida --render

Qué hace:
  1. Descarga la página (con --render usa un navegador headless para sitios JS como Framer).
  2. Encuentra TODOS los elementos que tengan esa clase.
  3. Extrae el HTML completo de cada uno (con todos sus hijos).
  4. Recolecta el CSS relevante:
       - <style> inline en la página
       - <link rel="stylesheet"> externos
       - Filtra solo las reglas cuyos selectores tocan alguna clase/tag dentro del subárbol.
  5. Descarga todas las imágenes referenciadas:
       - <img src> y srcset
       - background-image: url(...) en inline styles y en CSS
       - <source srcset> dentro de <picture>
  6. Guarda todo organizado en una carpeta:
       salida/
         index.html        ← HTML extraído (autocontenido, abre en el navegador)
         styles.css        ← CSS filtrado
         raw_full.css      ← Todo el CSS junto, sin filtrar (por si falta algo)
         images/           ← Imágenes descargadas
         report.txt        ← Resumen de lo que encontró
"""

import argparse
import os
import re
import sys
import hashlib
import mimetypes
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

# ---------- Dependencias ----------
# pip install requests beautifulsoup4 tinycss2
# Opcional para --render:  pip install playwright  &&  playwright install chromium
try:
    import requests
    from bs4 import BeautifulSoup
    import tinycss2
except ImportError as e:
    print("Faltan dependencias. Instala con:")
    print("  pip install requests beautifulsoup4 tinycss2")
    print("  (opcional para --render) pip install playwright && playwright install chromium")
    sys.exit(1)


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
}


# ============================================================
# 1. DESCARGA DE LA PÁGINA
# ============================================================

def fetch_static(url: str) -> str:
    """Descarga simple con requests (no ejecuta JS)."""
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return r.text


def fetch_rendered(url: str):
    """Descarga con Playwright (ejecuta JS, ideal para Framer/Webflow/Next/etc).

    Devuelve (html, cssom_dump):
      - html: snapshot del DOM tras JS + networkidle.
      - cssom_dump: TODO el CSS aplicado por el navegador, incluyendo
        document.adoptedStyleSheets y reglas inyectadas via insertRule()
        que no están en el textContent de los <style>.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Para usar --render instala:  pip install playwright && playwright install chromium")
        sys.exit(1)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(user_agent=HEADERS["User-Agent"])
        page = ctx.new_page()
        page.goto(url, wait_until="networkidle", timeout=60_000)
        # Espera extra por animaciones / fuentes
        page.wait_for_timeout(1500)
        try:
            page.evaluate("document.fonts && document.fonts.ready")
        except Exception:
            pass

        cssom_dump = page.evaluate(
            r"""
            () => {
              const chunks = [];
              const dumpSheet = (sheet, label) => {
                try {
                  const rules = sheet.cssRules || sheet.rules;
                  if (!rules) return;
                  const text = Array.from(rules).map(r => r.cssText).join('\n');
                  if (text) chunks.push(`/* ===== CSSOM: ${label} ===== */\n${text}`);
                } catch (e) {
                  // CORS — el caller descargará el href aparte
                }
              };
              for (const s of Array.from(document.styleSheets || [])) {
                dumpSheet(s, s.href || 'inline-stylesheet');
              }
              for (const s of Array.from(document.adoptedStyleSheets || [])) {
                dumpSheet(s, 'adoptedStyleSheet');
              }
              return chunks.join('\n\n');
            }
            """
        ) or ""

        html = page.content()
        browser.close()
        return html, cssom_dump


# ============================================================
# 2. RECOLECTAR CSS (inline + externo)
# ============================================================

def collect_css(soup: BeautifulSoup, base_url: str) -> str:
    """Devuelve TODO el CSS de la página concatenado (inline + externo)."""
    chunks = []

    # <style> inline
    for tag in soup.find_all("style"):
        if tag.string:
            chunks.append(f"/* ===== inline <style> ===== */\n{tag.string}")

    # <link rel="stylesheet">
    for link in soup.find_all("link", rel=lambda v: v and "stylesheet" in v):
        href = link.get("href")
        if not href:
            continue
        full = urljoin(base_url, href)
        try:
            r = requests.get(full, headers=HEADERS, timeout=30)
            if r.ok:
                chunks.append(f"/* ===== {full} ===== */\n{r.text}")
        except Exception as e:
            chunks.append(f"/* ERROR cargando {full}: {e} */")

    return "\n\n".join(chunks)


# ============================================================
# 3. FILTRAR CSS RELEVANTE
# ============================================================

# Tokens que pueden aparecer en un selector y referirse a un elemento del subárbol
def collect_subtree_tokens(root) -> set:
    """Junta todas las clases, ids y tags del subárbol para luego filtrar el CSS."""
    tokens = set()
    for el in [root] + root.find_all(True):
        if el.name:
            tokens.add(el.name.lower())
        for c in el.get("class", []) or []:
            tokens.add("." + c)
        if el.get("id"):
            tokens.add("#" + el["id"])
    return tokens


_SEL_TOKEN_RE = re.compile(r"[#.]?[A-Za-z_][A-Za-z0-9_-]*")
_ATTR_SEL_RE = re.compile(r"\[[^\]]+\]")

# Selectores globales que SIEMPRE conservamos: definen variables CSS, resets,
# fuentes, animaciones y bases que el resto del CSS asume aplicadas.
_GLOBAL_SEL_KEYWORDS = (":root", "html", "body", "*")

def _has_global_anchor(selector: str) -> bool:
    """¿El selector toca :root, html, body o *? (también dentro de :where/:is)."""
    s = selector.lower()
    # ':root' como keyword
    if ":root" in s:
        return True
    # tokens 'html' / 'body' / '*' como selector independiente
    # (evita que 'phtml' o 'antibody' den falso positivo)
    if re.search(r"(^|[\s,>+~(])(html|body)(?=$|[\s,>+~){:.\[#])", s):
        return True
    if re.search(r"(^|[\s,>+~(])\*(?=$|[\s,>+~){:.\[#])", s):
        return True
    return False


def selector_touches(selector: str, tokens: set) -> bool:
    """¿Este selector menciona alguna clase/id/tag del subárbol, o es un selector
    global / con atributos que conviene conservar?"""
    # Reglas globales (variables CSS de :root, resets, etc.)
    if _has_global_anchor(selector):
        return True
    # Selectores que dependen de atributos (Framer usa muchísimos
    # [data-framer-*], [class*=...]). Si no los conservamos, se pierden
    # cientos de reglas que se aplican al subárbol vía atributos.
    if _ATTR_SEL_RE.search(selector):
        return True
    found = _SEL_TOKEN_RE.findall(selector)
    for tok in found:
        if tok.startswith(".") or tok.startswith("#"):
            if tok in tokens:
                return True
        else:
            # tag suelto (div, h1, etc.) — solo lo aceptamos si el subárbol lo usa
            if tok.lower() in tokens:
                return True
    return False


def filter_css(css_text: str, tokens: set) -> str:
    """Devuelve solo las reglas cuyos selectores tocan el subárbol."""
    rules = tinycss2.parse_stylesheet(css_text, skip_whitespace=True, skip_comments=True)
    out = []

    def serialize(node):
        return tinycss2.serialize([node])

    for rule in rules:
        if rule.type == "qualified-rule":
            prelude = tinycss2.serialize(rule.prelude).strip()
            # múltiples selectores separados por coma
            selectors = [s.strip() for s in prelude.split(",")]
            kept = [s for s in selectors if selector_touches(s, tokens)]
            if kept:
                body = tinycss2.serialize(rule.content)
                out.append(f"{', '.join(kept)} {{{body}}}")
        elif rule.type == "at-rule":
            # @media, @supports → recursión sobre su contenido
            name = (rule.lower_at_keyword or "").lower()
            prelude = tinycss2.serialize(rule.prelude).strip()
            if rule.content is None:
                # @import, @charset → los conservamos por si acaso
                out.append(serialize(rule).strip())
                continue
            inner_text = tinycss2.serialize(rule.content)
            inner_filtered = filter_css(inner_text, tokens)
            if inner_filtered.strip():
                out.append(f"@{name} {prelude} {{\n{inner_filtered}\n}}")
            elif name in ("font-face", "keyframes", "-webkit-keyframes"):
                # Conservamos fuentes y animaciones siempre
                out.append(serialize(rule).strip())

    return "\n\n".join(out)


# ============================================================
# 4. ENCONTRAR Y DESCARGAR IMÁGENES
# ============================================================

URL_IN_CSS_RE = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")

def collect_image_urls(root, css_text: str, base_url: str) -> set:
    urls = set()

    # <img src>, <img srcset>, <source srcset>, <video poster>, <image href> (svg)
    for el in root.find_all(["img", "source", "video", "image"]):
        for attr in ("src", "poster", "href", "xlink:href"):
            v = el.get(attr)
            if v:
                urls.add(v)
        srcset = el.get("srcset")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    urls.add(u)

    # background-image inline
    for el in root.find_all(style=True):
        for m in URL_IN_CSS_RE.findall(el["style"]):
            urls.add(m)

    # background-image en CSS filtrado
    for m in URL_IN_CSS_RE.findall(css_text):
        urls.add(m)

    # Resolver a absolutas y filtrar data: / blob:
    out = set()
    for u in urls:
        u = u.strip()
        if not u or u.startswith(("data:", "blob:", "javascript:", "#")):
            continue
        out.add(urljoin(base_url, u))
    return out


def collect_all_asset_urls(soup: BeautifulSoup, css_text: str, base_url: str) -> set:
    """Modo --full: junta CADA recurso referenciado en la página (no solo del subárbol).
    Cubre img/srcset, video, audio, source, picture, link[icon|manifest], scripts,
    iframes (solo si same-origin), og:image / twitter:image, fuentes y url(...) en CSS."""
    urls = set()

    # Etiquetas multimedia y de embebidos
    for el in soup.find_all(["img", "source", "video", "audio", "image", "iframe", "embed", "object"]):
        for attr in ("src", "poster", "href", "xlink:href", "data"):
            v = el.get(attr)
            if v:
                urls.add(v)
        srcset = el.get("srcset")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    urls.add(u)

    # <link rel="icon|apple-touch-icon|manifest|preload|mask-icon|shortcut icon">
    for el in soup.find_all("link"):
        rel = " ".join(el.get("rel") or []).lower()
        if any(k in rel for k in ("icon", "manifest", "preload", "image", "apple-touch")):
            v = el.get("href")
            if v:
                urls.add(v)

    # <script src>
    for el in soup.find_all("script", src=True):
        urls.add(el["src"])

    # og:image, twitter:image
    for el in soup.find_all("meta"):
        prop = (el.get("property") or el.get("name") or "").lower()
        if prop in ("og:image", "og:image:url", "og:image:secure_url",
                    "twitter:image", "twitter:image:src"):
            v = el.get("content")
            if v:
                urls.add(v)

    # background-image y url(...) en estilos inline de cualquier elemento
    for el in soup.find_all(style=True):
        for m in URL_IN_CSS_RE.findall(el["style"]):
            urls.add(m)

    # url(...) en TODO el CSS (fuentes, fondos, máscaras, etc.)
    for m in URL_IN_CSS_RE.findall(css_text):
        urls.add(m)

    out = set()
    for u in urls:
        u = u.strip()
        if not u or u.startswith(("data:", "blob:", "javascript:", "mailto:", "tel:", "#")):
            continue
        out.add(urljoin(base_url, u))
    return out


_FONT_EXTS = (".woff2", ".woff", ".ttf", ".otf", ".eot")
_VIDEO_EXTS = (".mp4", ".webm", ".mov", ".m4v", ".ogv")
_AUDIO_EXTS = (".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac")
_SCRIPT_EXTS = (".js", ".mjs")
_STYLE_EXTS = (".css",)

def _bucket_for(name: str, content_type: str) -> str:
    n = name.lower()
    ct = (content_type or "").lower()
    if n.endswith(_FONT_EXTS) or "font" in ct:
        return "fonts"
    if n.endswith(_VIDEO_EXTS) or ct.startswith("video/"):
        return "videos"
    if n.endswith(_AUDIO_EXTS) or ct.startswith("audio/"):
        return "audio"
    if n.endswith(_SCRIPT_EXTS) or "javascript" in ct:
        return "scripts"
    if n.endswith(_STYLE_EXTS) or "css" in ct:
        return "css"
    return "images"


def download_assets(urls: set, base_dir: Path, single_bucket: str | None = None) -> dict:
    """Descarga URLs y devuelve {url_original: ruta_local_relativa}.

    Si single_bucket está dado (p.ej. 'images'), todo va a esa carpeta (modo
    extract). En --full reparte por tipo: images/, fonts/, videos/, scripts/,
    css/, audio/."""
    base_dir.mkdir(parents=True, exist_ok=True)
    mapping = {}
    for u in sorted(urls):
        try:
            r = requests.get(u, headers=HEADERS, timeout=30)
            if not r.ok:
                print(f"  ✗ {r.status_code}  {u}")
                continue
            path = unquote(urlparse(u).path)
            name = os.path.basename(path) or "asset"
            content_type = r.headers.get("Content-Type", "")
            if "." not in name:
                ext = mimetypes.guess_extension(content_type.split(";")[0]) or ".bin"
                name += ext

            bucket = single_bucket or _bucket_for(name, content_type)
            bucket_dir = base_dir if single_bucket else base_dir / bucket
            bucket_dir.mkdir(parents=True, exist_ok=True)

            target = bucket_dir / name
            if target.exists() and target.read_bytes() != r.content:
                h = hashlib.md5(u.encode()).hexdigest()[:6]
                stem, ext = os.path.splitext(name)
                target = bucket_dir / f"{stem}_{h}{ext}"
            target.write_bytes(r.content)
            rel = f"{bucket}/{target.name}" if not single_bucket else f"{single_bucket}/{target.name}"
            mapping[u] = rel
            print(f"  ✓ {rel}  ({len(r.content)//1024} KB)")
        except Exception as e:
            print(f"  ✗ error {u}: {e}")
    return mapping


# Alias compat
def download_images(urls: set, out_dir: Path) -> dict:
    return download_assets(urls, out_dir, single_bucket="images")


# ============================================================
# 5. REESCRIBIR HTML/CSS PARA QUE SEA AUTOCONTENIDO
# ============================================================

def rewrite_local(html_or_css: str, mapping: dict) -> str:
    """Sustituye URLs absolutas por rutas locales.

    Ordena por longitud descendente para que URLs con query string (más largas)
    se reemplacen ANTES que el mismo path sin query — si no, la versión corta
    tapa a la larga y deja `?width=...` colgando. También cubre la forma
    HTML-encoded `&amp;` que aparece en atributos srcset/href."""
    out = html_or_css
    for original in sorted(mapping.keys(), key=len, reverse=True):
        local = mapping[original]
        out = out.replace(original, local)
        if "&" in original:
            out = out.replace(original.replace("&", "&amp;"), local)
    return out


# ============================================================
# 6. CLON EXACTO (--full)
# ============================================================

def run_full_clone(soup: BeautifulSoup, html: str, cssom_dump: str, base_url: str, out_dir: Path, keep_scripts: bool):
    """Clona la página entera tal cual: HTML completo + todos los assets locales."""

    # 1) CSS bruto (todo, sin filtrar) — incluye CSSOM dinámico
    print("→ Recolectando CSS...")
    raw_css = collect_css(soup, base_url)
    if cssom_dump:
        raw_css += "\n\n/* ===== CSSOM dump (adoptedStyleSheets + insertRule) ===== */\n" + cssom_dump
        print(f"  + {len(cssom_dump):,} chars de CSSOM dinámico")
    (out_dir / "raw_full.css").write_text(raw_css, encoding="utf-8")

    # 2) Detectar TODOS los assets (incluye fuentes en CSS, og:image, scripts)
    print("→ Buscando assets (img, video, audio, fonts, scripts, icons, og)...")
    asset_urls = collect_all_asset_urls(soup, raw_css, base_url)
    print(f"  {len(asset_urls)} URLs únicas. Descargando a buckets (images/, fonts/, videos/, scripts/, css/)...")
    mapping = download_assets(asset_urls, out_dir)

    # 3) Reescribir HTML y CSS con rutas locales
    rewritten_html = rewrite_local(html, mapping)
    rewritten_css = rewrite_local(raw_css, mapping)

    # 4) Limpiar HTML: opcionalmente quita <script>, mantiene todo lo demás
    soup_out = BeautifulSoup(rewritten_html, "html.parser")
    if not keep_scripts:
        for s in soup_out.find_all("script"):
            s.decompose()

    # 5) Inyecta nuestro raw_full.css local al final del <head> como red de
    #    seguridad por si alguna regla CSSOM dinámica no quedó en el DOM.
    if soup_out.head:
        local_link = soup_out.new_tag("link", rel="stylesheet", href="raw_full.css")
        soup_out.head.append(local_link)

    final_html = str(soup_out)
    (out_dir / "index.html").write_text(final_html, encoding="utf-8")
    (out_dir / "raw_full.css").write_text(rewritten_css, encoding="utf-8")

    # Reporte
    bucket_counts = {}
    for local in mapping.values():
        bucket = local.split("/", 1)[0]
        bucket_counts[bucket] = bucket_counts.get(bucket, 0) + 1
    report = [
        f"URL:           {base_url}",
        f"Modo:          --full (clon exacto)",
        f"Scripts:       {'conservados' if keep_scripts else 'eliminados'}",
        f"Assets:        {len(mapping)} descargados / {len(asset_urls)} encontrados",
        *[f"  {b}: {c}" for b, c in sorted(bucket_counts.items())],
        f"CSS bruto:     {len(rewritten_css):,} caracteres",
        f"HTML final:    {len(final_html):,} caracteres",
    ]
    (out_dir / "report.txt").write_text("\n".join(report), encoding="utf-8")
    print("\n" + "─" * 50)
    print("\n".join(report))
    print("─" * 50)
    print(f"\n✅ Listo. Abre  {out_dir / 'index.html'}  en tu navegador.")


# ============================================================
# 7. MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser(description="Extrae HTML + CSS + imágenes de una clase específica, o clona la página entera con --full.")
    ap.add_argument("url", help="URL de la página")
    ap.add_argument("clase", nargs="?", default=None, help="Nombre de la clase (sin el punto). Omite si usas --full.")
    ap.add_argument("--out", default="salida", help="Carpeta de salida")
    ap.add_argument("--render", action="store_true", help="Usar navegador headless (recomendado para Framer/Next/SPAs)")
    ap.add_argument("--full", action="store_true", help="Clon EXACTO de la página entera (HTML + todos los assets, sin filtrar). Ignora 'clase'.")
    ap.add_argument("--keep-scripts", action="store_true", help="(--full) Conservar <script> tags. Por defecto se eliminan para clon estático.")
    args = ap.parse_args()

    if not args.full and not args.clase:
        ap.error("debes pasar 'clase' o usar --full")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"→ Descargando {args.url} ({'render JS' if args.render else 'estático'})...")
    if args.render:
        html, cssom_dump = fetch_rendered(args.url)
    else:
        html = fetch_static(args.url)
        cssom_dump = ""

    soup = BeautifulSoup(html, "html.parser")

    # ───────── modo --full ─────────
    if args.full:
        run_full_clone(soup, html, cssom_dump, args.url, out_dir, args.keep_scripts)
        return

    images_dir = out_dir / "images"
    matches = soup.find_all(class_=args.clase)
    if not matches:
        print(f"✗ No encontré ningún elemento con la clase '{args.clase}'.")
        print("  Sugerencia: si el sitio usa JS (Framer, Next, etc.), añade --render")
        sys.exit(2)
    print(f"✓ {len(matches)} elemento(s) con la clase '{args.clase}' encontrados.")

    # CSS bruto y filtrado
    print("→ Recolectando CSS...")
    raw_css = collect_css(soup, args.url)
    if cssom_dump:
        # Añade adoptedStyleSheets + reglas inyectadas via insertRule() que
        # no aparecen en el texto de los <style>.
        raw_css += "\n\n/* ===== CSSOM dump (adoptedStyleSheets + insertRule) ===== */\n" + cssom_dump
        print(f"  + {len(cssom_dump):,} chars de CSSOM dinámico (adopted/insertRule)")
    (out_dir / "raw_full.css").write_text(raw_css, encoding="utf-8")

    print("→ Filtrando CSS relevante al subárbol...")
    tokens = set()
    for m in matches:
        tokens |= collect_subtree_tokens(m)
    tokens.add("." + args.clase)
    filtered_css = filter_css(raw_css, tokens)

    # Imágenes
    print("→ Buscando imágenes...")
    img_urls = set()
    for m in matches:
        img_urls |= collect_image_urls(m, filtered_css, args.url)
    print(f"  {len(img_urls)} URLs únicas. Descargando...")
    mapping = download_images(img_urls, images_dir)

    # HTML combinado de todos los matches + reescribir URLs
    parts = []
    for i, m in enumerate(matches, 1):
        parts.append(f"<!-- match {i} -->\n{m.prettify()}")
    extracted_html = "\n\n".join(parts)
    extracted_html = rewrite_local(extracted_html, mapping)
    filtered_css = rewrite_local(filtered_css, mapping)

    # Construye un clon FIEL: conserva <html>, <head> y <body> originales
    # (atributos, metas, <style> inline, orden) y reemplaza el cuerpo por solo
    # el subárbol extraído. Quita <script> y <link rel=stylesheet> externos
    # (esos ya están descargados / inlined). Esto es crítico porque muchas
    # reglas dependen de class/data-* en <html> (p.ej. html.lenis) y del orden
    # de insertion de los <style> de Framer.
    html_tag = soup.html
    head_tag = soup.head
    body_tag = soup.body

    def attrs_str(tag):
        if not tag:
            return ""
        out = []
        for k, v in (tag.attrs or {}).items():
            if isinstance(v, list):
                v = " ".join(v)
            out.append(f'{k}="{v}"' if v != "" else k)
        return (" " + " ".join(out)) if out else ""

    # <head> sin <script> ni <link rel=stylesheet> externos. Re-inyectamos
    # nuestro link local al final para tapar lo que falte.
    head_html = ""
    if head_tag:
        head_copy = BeautifulSoup(str(head_tag), "html.parser")
        for s in head_copy.find_all("script"):
            s.decompose()
        for l in head_copy.find_all("link", rel=lambda v: v and "stylesheet" in v):
            l.decompose()
        # Quita <link rel="preload"> de scripts/sheets para evitar warnings
        for l in head_copy.find_all("link", rel=lambda v: v and ("preload" in v or "modulepreload" in v)):
            l.decompose()
        head_inner = head_copy.head.decode_contents() if head_copy.head else str(head_copy)
        head_inner = rewrite_local(head_inner, mapping)
        head_html = head_inner

    # <body> sin scripts; conservamos atributos pero reemplazamos contenido
    body_attrs = attrs_str(body_tag)
    html_attrs = attrs_str(html_tag) if html_tag else ' lang="en"'

    page = f"""<!doctype html>
<html{html_attrs}>
<head>
{head_html}
<link rel="stylesheet" href="styles.css">
</head>
<body{body_attrs}>
{extracted_html}
</body>
</html>
"""
    (out_dir / "index.html").write_text(page, encoding="utf-8")
    (out_dir / "styles.css").write_text(filtered_css, encoding="utf-8")

    # Reporte
    report = [
        f"URL:           {args.url}",
        f"Clase:         .{args.clase}",
        f"Modo:          {'render JS' if args.render else 'estático'}",
        f"Coincidencias: {len(matches)}",
        f"Imágenes:      {len(mapping)} descargadas / {len(img_urls)} encontradas",
        f"CSS filtrado:  {len(filtered_css):,} caracteres",
        f"CSS bruto:     {len(raw_css):,} caracteres",
    ]
    (out_dir / "report.txt").write_text("\n".join(report), encoding="utf-8")

    print("\n" + "─" * 50)
    print("\n".join(report))
    print("─" * 50)
    print(f"\n✅ Listo. Abre  {out_dir / 'index.html'}  en tu navegador.")


if __name__ == "__main__":
    main()