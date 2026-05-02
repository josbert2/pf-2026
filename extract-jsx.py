#!/usr/bin/env python3
"""
extract-jsx.py — Extrae UNA clase del HTML clonado y la convierte a un
componente React/JSX limpio.

Modelo parecido a extract-p.py pero al revés: en lugar de descargar una
URL, lee de clone-full/index.html (o la fuente que pases) y emite un
componente .tsx que puedes importar directamente.

Uso:
    python3 extract-jsx.py <CLASE> [opciones]

Ejemplos:
    # Extrae .framer-1l48016 (la card Bash) → src/components/work/Bash.tsx
    python3 extract-jsx.py framer-1l48016 --name Bash

    # Extrae .framer-qac7gu (Top section) con nombre y carpeta personalizados
    python3 extract-jsx.py framer-qac7gu --name TopSection --out src/components/work/

    # Lista TODAS las clases framer-* del clon (con preview del contenido)
    python3 extract-jsx.py --list

    # Lista solo las clases con un texto concreto
    python3 extract-jsx.py --list --grep "Bash"

    # Lista clases con data-framer-name
    python3 extract-jsx.py --list-named

Opciones:
    --src PATH        HTML fuente (default: clone-full/index.html)
    --out PATH        Carpeta o archivo de salida (default: src/components/work/)
    --name NOMBRE     Nombre del componente (default: deducido de la clase)
    --no-framer-cls   Quita las clases framer-* del JSX (CSS no aplicará)
    --keep-default    NO limpia los estilos default de Framer (más ruidoso)
    --asset-prefix P  Prefijo para reescribir paths de assets (default /work-clone)
"""
import argparse
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment

try:
    import tinycss2
    HAS_TINYCSS = True
except ImportError:
    HAS_TINYCSS = False


# ============================================================
# 1. LIMPIEZA DE STYLE INLINE (Framer dumpea defaults absurdos)
# ============================================================

KEEP_PROPS = {
    # Layout
    "display", "flex-direction", "flex-wrap", "flex-basis", "flex-grow",
    "flex-shrink", "flex", "align-items", "align-content", "align-self",
    "justify-content", "justify-items", "justify-self", "place-items",
    "place-content", "gap", "row-gap", "column-gap",
    "grid-template-columns", "grid-template-rows", "grid-template-areas",
    "grid-column", "grid-row", "grid-auto-flow",
    # Box
    "position", "top", "right", "bottom", "left", "inset", "z-index",
    "width", "height", "min-width", "min-height", "max-width", "max-height",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "box-sizing", "overflow", "overflow-x", "overflow-y",
    "aspect-ratio",
    # Visual
    "background", "background-color", "background-image", "background-size",
    "background-position", "background-repeat", "background-attachment",
    "color", "opacity", "visibility",
    "border", "border-top", "border-right", "border-bottom", "border-left",
    "border-width", "border-style", "border-color", "border-radius",
    "border-top-left-radius", "border-top-right-radius",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "box-shadow", "outline",
    # Transform / motion
    "transform", "rotate", "scale", "translate", "will-change",
    # Typography
    "font-family", "font-size", "font-weight", "font-style", "line-height",
    "letter-spacing", "text-align", "text-transform", "text-decoration",
    "white-space", "word-break", "overflow-wrap",
    # Misc
    "cursor", "pointer-events", "user-select", "mix-blend-mode",
    "filter", "backdrop-filter", "clip-path",
    "object-fit", "object-position",
}

DEFAULT_VALUES = {"auto", "none", "normal", "initial", "static", "visible",
                  "transparent", "currentcolor", "0", "0px", "0%", "1",
                  "rgba(0, 0, 0, 0)", "rgb(0, 0, 0)"}

DEFAULT_PAIRS = {
    ("background-attachment", "scroll"), ("background-position", "0% 0%"),
    ("background-repeat", "repeat"), ("background-size", "auto"),
    ("background-clip", "border-box"), ("background-origin", "padding-box"),
    ("box-sizing", "border-box"), ("display", "block"),
    ("flex-direction", "row"), ("flex-wrap", "nowrap"),
    ("flex-grow", "0"), ("flex-shrink", "1"), ("flex-basis", "auto"),
    ("font-family", "sans-serif"), ("font-size", "12px"), ("font-weight", "400"),
    ("font-style", "normal"), ("line-height", "normal"), ("letter-spacing", "normal"),
    ("object-fit", "fill"), ("object-position", "50% 50%"),
    ("text-align", "start"), ("text-transform", "none"), ("text-decoration", "none"),
    ("white-space", "normal"), ("word-break", "normal"), ("overflow-wrap", "normal"),
    ("cursor", "auto"), ("pointer-events", "auto"), ("user-select", "auto"),
    ("visibility", "visible"), ("opacity", "1"), ("mix-blend-mode", "normal"),
    ("will-change", "auto"), ("column-gap", "normal"), ("row-gap", "normal"),
    ("aspect-ratio", "auto"),
}

DROP_PROPS_ALWAYS = {"perspective-origin", "transform-origin", "transform-box",
                     "transform-style"}


def kebab_to_camel(s: str) -> str:
    parts = s.split("-")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


def clean_style(style_str: str, keep_default: bool = False) -> dict:
    out = {}
    for rule in style_str.split(";"):
        rule = rule.strip()
        if ":" not in rule:
            continue
        k, _, v = rule.partition(":")
        k, v = k.strip(), v.strip()
        # IMPORTANTE: las CSS custom properties (--framer-font-family,
        # --framer-text-color, --token-*, --font-selector, etc.) son DATOS
        # — no ruido. Si las descartas, el texto pierde fuente y color.
        if k.startswith("--"):
            out[k] = v  # se conserva con la sintaxis kebab-case original
            continue
        if k.startswith("-webkit-"):
            continue
        if k in DROP_PROPS_ALWAYS:
            continue
        if not keep_default:
            if k not in KEEP_PROPS:
                continue
            if v in DEFAULT_VALUES:
                continue
            if (k, v) in DEFAULT_PAIRS:
                continue
            if k in {"top", "right", "bottom", "left"} and v in {"0px", "0"}:
                continue
            if k == "transform" and v == "none":
                continue
        out[kebab_to_camel(k)] = v
    return out


def style_to_jsx(style: dict) -> str:
    if not style:
        return ""
    parts = []
    for k, v in style.items():
        v_esc = v.replace("'", chr(92) + chr(39))
        # Las claves con guión (custom properties --foo, kebab) deben ir entre
        # comillas en JSX porque no son identificadores JS válidos.
        if "-" in k:
            parts.append(f"'{k}': '{v_esc}'")
        else:
            parts.append(f"{k}: '{v_esc}'")
    return "{{ " + ", ".join(parts) + " }}"


# ============================================================
# 2. EMISIÓN JSX
# ============================================================

SELF_CLOSING = {"img", "br", "hr", "input", "meta", "link", "use", "path",
                "circle", "rect"}

ATTR_RENAME = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "viewbox": "viewBox", "srcset": "srcSet",
    "preserveaspectratio": "preserveAspectRatio", "xlink:href": "xlinkHref",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray",
    "stroke-dashoffset": "strokeDashoffset", "fill-rule": "fillRule",
    "clip-rule": "clipRule", "stop-color": "stopColor", "stop-opacity": "stopOpacity",
}

DROP_ATTRS = {
    "data-framer-background-image-wrapper", "data-framer-component-type",
    "data-border", "draggable", "decoding", "crossorigin",
    "_constraints", "parentsize", "rotation", "shadows", "name",
    "data-highlight", "data-framer-page-link-current",
    "data-framer-appear-id", "data-framer-original-sizes",
}

NUMERIC_ATTRS = {"tabIndex"}
FORCE_VALUE_ATTRS = {"alt", "src", "href", "srcSet", "sizes"}


def reactify(node, keep_framer_classes: bool, keep_default_styles: bool) -> str:
    # Drop HTML comments enteros (Next/Framer dejan <!--$--> y <!--/$-->)
    if isinstance(node, Comment):
        return ""
    if isinstance(node, str):
        text = node.strip()
        if not text:
            return ""
        text = text.replace("{", '{"{"}').replace("}", '{"}"}')
        return text
    if node.name is None or node.name in ("script", "style"):
        return ""

    attrs = []
    for attr, val in (node.attrs or {}).items():
        if attr in DROP_ATTRS:
            continue
        jsx_attr = ATTR_RENAME.get(attr, attr)
        if isinstance(val, list):
            val = " ".join(val)
        if attr == "style":
            cleaned = clean_style(val, keep_default=keep_default_styles)
            if cleaned:
                attrs.append(f"style={style_to_jsx(cleaned)}")
            continue
        if attr == "class":
            if keep_framer_classes:
                cls = val
            else:
                cls = " ".join(c for c in val.split()
                               if not re.match(r"^(framer-|ssr-variant|hidden-)", c))
            if cls:
                attrs.append(f'className="{cls}"')
            continue
        if "-" in jsx_attr and not jsx_attr.startswith("data-") and not jsx_attr.startswith("aria-"):
            jsx_attr = kebab_to_camel(jsx_attr)
        if val == "" or val is None:
            if jsx_attr in FORCE_VALUE_ATTRS:
                attrs.append(f'{jsx_attr}=""')
            else:
                attrs.append(jsx_attr)
        else:
            if jsx_attr in NUMERIC_ATTRS:
                try:
                    attrs.append(f"{jsx_attr}={{{int(val)}}}")
                    continue
                except (TypeError, ValueError):
                    pass
            vs = str(val).replace('"', "&quot;")
            attrs.append(f'{jsx_attr}="{vs}"')

    attrs_str = (" " + " ".join(attrs)) if attrs else ""
    kids = "".join(reactify(c, keep_framer_classes, keep_default_styles)
                   for c in node.children)
    if node.name in SELF_CLOSING:
        return f"<{node.name}{attrs_str} />"
    return f"<{node.name}{attrs_str}>{kids}</{node.name}>"


# ============================================================
# 3. FILTRO DE CSS — extrae las reglas relevantes al subárbol
# ============================================================

_SEL_TOKEN_RE = re.compile(r"[#.]?[A-Za-z_][A-Za-z0-9_-]*")
_ATTR_SEL_RE = re.compile(r"\[[^\]]+\]")


# Clases utility de Framer que aparecen en TODO el sitio (tipografía, presets,
# variantes SSR). Si las incluyéramos en los tokens del subárbol, cualquier
# componente arrastraría cientos de reglas globales que viven mejor en un CSS
# compartido. Las excluimos del matching.
_UTILITY_CLASS_PATTERNS = (
    re.compile(r"^\.framer-text$"),
    re.compile(r"^\.framer-styles-preset-"),
    re.compile(r"^\.framer-image$"),
    re.compile(r"^\.framer-19wstzj$"),       # preset de <a> link
    re.compile(r"^\.ssr-variant$"),
    re.compile(r"^\.hidden-"),
    re.compile(r"^\.lenis"),
    re.compile(r"^\.framer-text-module$"),
    re.compile(r"^\.framer-table-wrapper$"),
)


def _is_utility_class(tok: str) -> bool:
    return any(p.match(tok) for p in _UTILITY_CLASS_PATTERNS)


def collect_subtree_tokens(root) -> set:
    """Junta clases/ids/tags del subárbol para filtrar el CSS — sin las
    utilities globales de Framer (framer-text, framer-styles-preset-*, etc.).
    """
    tokens = set()
    for el in [root] + (root.find_all(True) if hasattr(root, "find_all") else []):
        if el.name:
            tokens.add(el.name.lower())
        for c in el.get("class", []) or []:
            tok = "." + c
            if not _is_utility_class(tok):
                tokens.add(tok)
        if el.get("id"):
            tokens.add("#" + el["id"])
    return tokens


def _selector_touches(selector: str, tokens: set, include_globals: bool) -> bool:
    s = selector.lower()
    # Globales (resets, variables, [data-framer-*]) — solo en modo full
    if include_globals:
        if ":root" in s:
            return True
        if re.search(r"(^|[\s,>+~(])(html|body)(?=$|[\s,>+~){:.\[#])", s):
            return True
        if re.search(r"(^|[\s,>+~(])\*(?=$|[\s,>+~){:.\[#])", s):
            return True
        if _ATTR_SEL_RE.search(selector):
            return True
    # Modo estricto: solo si el selector menciona una clase/id del subárbol
    found = _SEL_TOKEN_RE.findall(selector)
    for tok in found:
        if tok.startswith(".") or tok.startswith("#"):
            if tok in tokens:
                return True
    # En modo estricto NO aceptamos tags sueltos (div, p) — generan ruido.
    # En modo full sí.
    if include_globals:
        for tok in found:
            if not (tok.startswith(".") or tok.startswith("#")):
                if tok.lower() in tokens:
                    return True
    return False


def filter_css(css_text: str, tokens: set, include_globals: bool = False,
               include_fonts: bool = False) -> str:
    """Devuelve solo las reglas relevantes al subárbol.

    Por defecto (modo estricto, ideal para CSS por componente):
      - SOLO reglas con selectores que mencionan una clase/id del subárbol
      - NO @font-face (van en un global compartido)
      - NO @keyframes huérfanos (sin uso en el subárbol)

    Con include_globals=True añade :root, html, body, *, [attr] (modo full).
    Con include_fonts=True conserva @font-face siempre.
    """
    if not HAS_TINYCSS:
        return ""
    rules = tinycss2.parse_stylesheet(css_text, skip_whitespace=True, skip_comments=True)
    out = []

    def serialize(node):
        return tinycss2.serialize([node])

    for rule in rules:
        if rule.type == "qualified-rule":
            prelude = tinycss2.serialize(rule.prelude).strip()
            selectors = [s.strip() for s in prelude.split(",")]
            kept = [s for s in selectors if _selector_touches(s, tokens, include_globals)]
            if kept:
                body = tinycss2.serialize(rule.content)
                out.append(f"{', '.join(kept)} {{{body}}}")
        elif rule.type == "at-rule":
            name = (rule.lower_at_keyword or "").lower()
            prelude = tinycss2.serialize(rule.prelude).strip()
            if rule.content is None:
                # @import / @charset — solo si modo full
                if include_globals:
                    out.append(serialize(rule).strip())
                continue
            inner_text = tinycss2.serialize(rule.content)
            inner_filtered = filter_css(inner_text, tokens,
                                        include_globals=include_globals,
                                        include_fonts=include_fonts)
            if inner_filtered.strip():
                out.append(f"@{name} {prelude} {{\n{inner_filtered}\n}}")
            elif include_fonts and name in ("font-face",):
                out.append(serialize(rule).strip())
            elif include_globals and name in ("keyframes", "-webkit-keyframes"):
                out.append(serialize(rule).strip())

    return "\n\n".join(out)


# ============================================================
# 4. UTILS
# ============================================================

def rewrite_paths(html: str, prefix: str) -> str:
    """images/X.png → /work-clone/images/X.png (configurable)."""
    out = re.sub(r"(?<![\w/])(images|fonts|scripts)/", rf"{prefix}/\1/", html)
    out = out.replace(f"/{prefix}/", f"{prefix}/")  # evita dobles barras
    return out


def deduce_component_name(class_name: str) -> str:
    """framer-1l48016 → FramerExtract1l48016. Lo dejamos a tu gusto vía --name."""
    safe = re.sub(r"[^a-zA-Z0-9]", "", class_name)
    return "Extract" + safe[0].upper() + safe[1:]


def collect_external_svg_defs(node, full_soup: BeautifulSoup,
                              keep_framer_classes: bool,
                              keep_default_styles: bool) -> tuple[str, int]:
    """Encuentra todos los <use href="#X"> dentro del subárbol y trae los
    elementos referenciados (symbols, svgs) que viven fuera. Devuelve un
    bloque JSX <svg><defs>...</defs></svg> reactificado para inyectar al
    principio del componente, junto con el número de refs encontradas.
    """
    refs = set()
    for use in node.find_all("use"):
        href = use.get("href") or use.get("xlink:href") or ""
        if href.startswith("#"):
            refs.add(href[1:])
    if not refs:
        return "", 0

    own_ids = {el.get("id") for el in node.find_all(True) if el.get("id")}

    parts = []
    for ref_id in refs:
        # No traemos los que ya están dentro del subárbol
        if ref_id in own_ids:
            continue
        target = full_soup.find(id=ref_id)
        if target is None:
            continue
        parts.append(reactify(target, keep_framer_classes, keep_default_styles))

    if not parts:
        return "", 0

    block = (
        '<svg aria-hidden="true" '
        'style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>'
        "<defs>" + "".join(parts) + "</defs></svg>"
    )
    return block, len(parts)


def detect_ancestor_classes(node) -> list:
    """Devuelve TODAS las clases framer-* (no utility) presentes en los
    ancestors del nodo, en orden raíz→padre. Sirven para stripear cualquier
    prefijo del CSS que no esté dentro del subárbol extraído."""
    seen = []
    cur = node.parent
    while cur is not None and cur.name:
        for c in (cur.get("class") or []):
            if c.startswith("framer-") and not _is_utility_class("." + c):
                if c not in seen:
                    seen.append(c)
        cur = cur.parent
    return seen


def strip_ancestor_prefixes(css_text: str, ancestor_classes: list) -> str:
    """Quita '.<ancestor> ' o '.<ancestor>>' del inicio de cada selector
    (incluyendo formas compuestas como '.A.B '). Hace múltiples pasadas
    para limpiar cadenas largas tipo '.framer-Zfc2C .framer-X .framer-Y'.
    """
    if not ancestor_classes:
        return css_text
    out = css_text
    # Múltiples pasadas (ancestor compuestos pueden quedar en cadena)
    for _ in range(3):
        for cls in ancestor_classes:
            # Caso compuesto: .Zfc2C.flnbsr al inicio o tras coma
            pat_compound = re.compile(
                r"(^|,\s*)\." + re.escape(cls) + r"(\.[A-Za-z_][A-Za-z0-9_-]*)*(?=[\s>])\s*",
                re.MULTILINE,
            )
            out = pat_compound.sub(r"\1", out)
    return out


def list_classes(soup: BeautifulSoup, grep: str | None = None,
                 only_named: bool = False, limit: int = 50):
    """Lista clases framer-* únicas con preview del contenido."""
    seen = {}
    for el in soup.find_all(class_=re.compile(r"framer-")):
        for cls in el.get("class", []):
            if not cls.startswith("framer-"):
                continue
            if cls.startswith(("framer-text", "framer-styles", "framer-v-")):
                continue
            name = el.get("data-framer-name", "") or ""
            if only_named and not name:
                continue
            text = el.get_text(" ", strip=True)[:60]
            if grep and grep.lower() not in (name + " " + text + " " + cls).lower():
                continue
            if cls in seen:
                continue
            seen[cls] = (name, text)
    print(f"\n{'CLASE':30s}  {'data-framer-name':25s}  PREVIEW")
    print("-" * 110)
    for cls, (name, text) in list(seen.items())[:limit]:
        print(f".{cls:29s}  {name[:24]:25s}  {text!r}")
    print(f"\n({len(seen)} clases únicas{' filtradas' if grep else ''})")


# ============================================================
# 4. MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser(
        description="Extrae UNA clase del HTML clonado y la convierte a un componente React.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument("clase", nargs="?", help="Nombre de la clase (sin el punto). Ej: framer-1l48016")
    ap.add_argument("--src", default="clone-full/index.html",
                    help="HTML fuente (default: clone-full/index.html)")
    ap.add_argument("--out", default="src/components/work/",
                    help="Carpeta o archivo de salida (default: src/components/work/)")
    ap.add_argument("--name", default=None, help="Nombre del componente")
    ap.add_argument("--no-framer-cls", action="store_true",
                    help="Quitar las clases framer-* del JSX")
    ap.add_argument("--keep-default", action="store_true",
                    help="No limpiar los estilos default de Framer")
    ap.add_argument("--asset-prefix", default="/work-clone",
                    help="Prefijo para reescribir paths de assets (default /work-clone)")
    ap.add_argument("--css-src", default="public/work-clone/work-clone.css",
                    help="CSS fuente para filtrar (default: public/work-clone/work-clone.css)")
    ap.add_argument("--no-css", action="store_true",
                    help="No extraer CSS (solo JSX)")
    ap.add_argument("--full-css", action="store_true",
                    help="Modo full: incluir :root, html, body, *, [attr] y @keyframes")
    ap.add_argument("--include-fonts", action="store_true",
                    help="Incluir @font-face en el CSS del componente (cuidado: pueden ser cientos)")
    ap.add_argument("--no-strip-root", action="store_true",
                    help="No quitar el prefijo de la clase raíz (ej. .framer-Zfc2C) de los selectores")
    ap.add_argument("--list", action="store_true",
                    help="Listar todas las clases framer-* del HTML")
    ap.add_argument("--list-named", action="store_true",
                    help="Listar solo clases con data-framer-name")
    ap.add_argument("--grep", default=None, help="Filtrar listado por texto")
    ap.add_argument("--limit", type=int, default=80, help="Límite de listado")
    args = ap.parse_args()

    src_path = Path(args.src)
    if not src_path.exists():
        print(f"✗ no existe: {src_path}", file=sys.stderr)
        sys.exit(2)
    soup = BeautifulSoup(src_path.read_text(), "html.parser")

    # Modo listado
    if args.list or args.list_named:
        list_classes(soup, grep=args.grep, only_named=args.list_named, limit=args.limit)
        return

    if not args.clase:
        ap.error("debes pasar una clase, o usar --list")

    cls = args.clase.lstrip(".")
    matches = soup.find_all(class_=cls)
    if not matches:
        print(f"✗ no encontré .{cls} en {src_path}", file=sys.stderr)
        print("   (usa --list para ver clases disponibles)", file=sys.stderr)
        sys.exit(2)
    if len(matches) > 1:
        print(f"⚠ encontré {len(matches)} elementos con .{cls}, uso el primero", file=sys.stderr)
    node = matches[0]

    # Convertir a JSX (sobre el subárbol entero del primer match)
    jsx = reactify(node,
                   keep_framer_classes=not args.no_framer_cls,
                   keep_default_styles=args.keep_default)

    # Trae los SVG <symbol> referenciados por <use> que viven fuera del
    # subárbol — sin esto, los iconos quedan en blanco.
    defs_block, defs_count = collect_external_svg_defs(
        node, soup,
        keep_framer_classes=not args.no_framer_cls,
        keep_default_styles=args.keep_default,
    )
    if defs_block:
        # Envolvemos en fragment <>...</> para mantener un único root.
        jsx = f"<>{defs_block}{jsx}</>"
        print(f"  + {defs_count} <symbol> SVG externos inyectados en <defs>",
              file=sys.stderr)

    # Reescribir paths
    jsx = rewrite_paths(jsx, args.asset_prefix)

    # Resolver salida
    name = args.name or deduce_component_name(cls)
    out_path = Path(args.out)
    if out_path.is_dir() or args.out.endswith("/"):
        out_path.mkdir(parents=True, exist_ok=True)
        out_path = out_path / f"{name}.tsx"

    css_path = None
    css_chars = 0
    if not args.no_css:
        if not HAS_TINYCSS:
            print("⚠ tinycss2 no instalado — saltando CSS. (pip install tinycss2)",
                  file=sys.stderr)
        else:
            css_src_path = Path(args.css_src)
            if not css_src_path.exists():
                print(f"⚠ CSS fuente no existe: {css_src_path} — saltando CSS",
                      file=sys.stderr)
            else:
                tokens = collect_subtree_tokens(node)
                tokens.add("." + cls)
                filtered = filter_css(
                    css_src_path.read_text(),
                    tokens,
                    include_globals=args.full_css,
                    include_fonts=args.include_fonts,
                )
                # Stripea TODOS los ancestor classes (.framer-Zfc2C, etc.)
                # para que el CSS aplique sin wrappear el componente.
                if not args.no_strip_root:
                    ancestors = detect_ancestor_classes(node)
                    if ancestors:
                        filtered = strip_ancestor_prefixes(filtered, ancestors)
                        print(f"  ancestor-prefixes removidos: {ancestors}",
                              file=sys.stderr)
                # Reescribir paths del CSS también
                filtered = rewrite_paths(filtered, args.asset_prefix)
                css_path = out_path.with_suffix(".css")
                css_path.write_text(
                    f"/* CSS filtrado de {css_src_path.name} para .{cls} */\n"
                    f"/* Generado por extract-jsx.py. Edita libremente. */\n\n"
                    + filtered
                )
                css_chars = len(filtered)

    css_import = f'import "./{out_path.stem}.css";\n' if css_path else ""

    component = (
        f'import React from "react";\n'
        f"{css_import}"
        f"\n"
        f"/**\n"
        f" * Extraído de {src_path.name} — clase .{cls}\n"
        f" * Generado por extract-jsx.py. Edita libremente.\n"
        f" */\n"
        f"export default function {name}() {{\n"
        f"  return (\n"
        f"    {jsx}\n"
        f"  );\n"
        f"}}\n"
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(component)

    print(f"✓ {name}  ←  .{cls}")
    print(f"  src:    {src_path}")
    print(f"  jsx:    {out_path}  ({len(component):,} chars)")
    if css_path:
        print(f"  css:    {css_path}  ({css_chars:,} chars)")
    framer_name = node.get("data-framer-name") or "(sin nombre)"
    print(f"  data-framer-name: {framer_name}")
    print(f"  text-preview: {node.get_text(' ', strip=True)[:80]!r}")


if __name__ == "__main__":
    main()
