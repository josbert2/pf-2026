"""
Convert `seccion.html` (Framer export) into a clean, editable React component
at `src/components/AboutSectionFramer.tsx`.

Framer inlines hundreds of default CSS properties per element. This script
keeps only the ones that actually affect rendering, so the output is readable.
"""
import re
from bs4 import BeautifulSoup

import sys

# Usage:
#   python3 convert_section.py              → seccion.html → AboutSectionFramer.tsx
#   python3 convert_section.py values       → values-section.html → ValuesSection.tsx
# Cada job: (html_in, jsx_out, component_name, root_selector, keep_framer_classes)
# - root_selector: tag/clase del elemento raíz a convertir. None = primer <div>.
# - keep_framer_classes: si True, conserva las clases framer-XXX en el JSX
#   (necesario cuando el CSS clonado externo es keyado por esas clases).
JOBS = {
    "about":  ("/home/jos/josbert.dev/pf-2026/seccion.html",
               "/home/jos/josbert.dev/pf-2026/src/components/AboutSectionFramer.tsx",
               "AboutSectionFramer", None, False),
    "values": ("/home/jos/josbert.dev/pf-2026/values-section.html",
               "/home/jos/josbert.dev/pf-2026/src/components/ValuesSection.tsx",
               "ValuesSection", None, False),
    # Work clone — Top section (4 cards: Bash, Pulse, Heygo, Dotslash)
    "work-top": ("/home/jos/josbert.dev/pf-2026/clone-full/index.html",
                 "/home/jos/josbert.dev/pf-2026/src/components/work/WorkTopSection.tsx",
                 "WorkTopSection", ".framer-qac7gu", True),
    # Work clone COMPLETO — todo el .framer-Zfc2C de clone-full/index.html
    "work-full": ("/home/jos/josbert.dev/pf-2026/clone-full/index.html",
                  "/home/jos/josbert.dev/pf-2026/src/components/work/WorkFull.tsx",
                  "WorkFull", ".framer-Zfc2C", True),
}
JOB = sys.argv[1] if len(sys.argv) > 1 else "about"
if JOB not in JOBS:
    raise SystemExit(f"Unknown job '{JOB}'. Choose: {', '.join(JOBS)}")
HTML_IN, JSX_OUT, COMPONENT_NAME, ROOT_SELECTOR, KEEP_FRAMER_CLASSES = JOBS[JOB]

# Only these CSS properties are kept. Everything else Framer dumps (animation-*,
# backdrop-filter, buffered-rendering, alignment-baseline, --token-*, etc.) is
# dropped because it's a default or inherited value.
KEEP_PROPS = {
    # Layout
    "display", "flex-direction", "flex-wrap", "flex-basis", "flex-grow",
    "flex-shrink", "flex", "align-items", "align-content", "align-self",
    "justify-content", "justify-items", "justify-self", "place-items",
    "place-content", "gap", "row-gap", "column-gap",
    "grid-template-columns", "grid-template-rows", "grid-template-areas",
    "grid-column", "grid-row", "grid-auto-flow",
    # Positioning / box
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
    "border-width", "border-style", "border-color",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
    "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
    "border-radius",
    "border-top-left-radius", "border-top-right-radius",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "box-shadow", "outline",
    # Transform / motion
    "transform", "transform-origin", "rotate", "scale", "translate",
    "perspective", "perspective-origin",
    "will-change",
    # Typography
    "font-family", "font-size", "font-weight", "font-style", "line-height",
    "letter-spacing", "text-align", "text-transform", "text-decoration",
    "white-space", "word-break", "overflow-wrap",
    # Misc
    "cursor", "pointer-events", "user-select", "mix-blend-mode",
    "filter", "backdrop-filter", "clip-path",
    "object-fit", "object-position",
}

# Values that are CSS defaults — drop the prop entirely when it has one of these.
DEFAULT_VALUES = {
    "auto", "none", "normal", "initial", "static",
    "visible", "transparent", "currentcolor",
    "0", "0px", "0%", "1",
    "rgba(0, 0, 0, 0)", "rgb(0, 0, 0)",
}

# (property, value) pairs Framer dumps on EVERY element because they're
# computed defaults. Drop them entirely.
DEFAULT_PAIRS = {
    ("background-attachment", "scroll"),
    ("background-position", "0% 0%"),
    ("background-repeat", "repeat"),
    ("background-size", "auto"),
    ("background-blend-mode", "normal"),
    ("background-clip", "border-box"),
    ("background-origin", "padding-box"),
    ("box-sizing", "border-box"),
    ("display", "block"),              # default display
    ("flex-direction", "row"),          # default
    ("flex-wrap", "nowrap"),
    ("flex-grow", "0"),
    ("flex-shrink", "1"),
    ("flex-basis", "auto"),
    ("grid-auto-flow", "row"),
    ("font-family", "sans-serif"),
    ("font-size", "12px"),
    ("font-weight", "400"),
    ("font-style", "normal"),
    ("line-height", "normal"),
    ("letter-spacing", "normal"),
    ("object-fit", "fill"),
    ("object-position", "50% 50%"),
    ("text-align", "start"),
    ("text-transform", "none"),
    ("text-decoration", "none"),
    ("white-space", "normal"),
    ("word-break", "normal"),
    ("overflow-wrap", "normal"),
    ("cursor", "auto"),
    ("pointer-events", "auto"),
    ("user-select", "auto"),
    ("visibility", "visible"),
    ("opacity", "1"),
    ("mix-blend-mode", "normal"),
    ("will-change", "auto"),
    ("column-gap", "normal"),
    ("row-gap", "normal"),
    ("align-content", "normal"),
    ("align-items", "normal"),
    ("align-self", "auto"),
    ("justify-content", "normal"),
    ("justify-items", "normal"),
    ("justify-self", "auto"),
    ("place-items", "normal"),
    ("place-content", "normal"),
    ("column-gap", "10px"),             # Framer's magic default gap
    ("row-gap", "10px"),
    ("aspect-ratio", "auto"),
}

# These properties only matter when paired with a matching transform/perspective.
# Drop them unconditionally to reduce noise.
DROP_PROPS_ALWAYS = {
    "perspective-origin",
    "transform-origin",
    "transform-box",
    "transform-style",
}

def kebab_to_camel(s: str) -> str:
    parts = s.split('-')
    return parts[0] + ''.join(w.capitalize() for w in parts[1:])

def clean_style(style_str: str) -> dict:
    """Parse and prune an inline style string."""
    out = {}
    for rule in style_str.split(';'):
        rule = rule.strip()
        if ':' not in rule:
            continue
        k, _, v = rule.partition(':')
        k = k.strip()
        v = v.strip()
        # Drop Framer CSS variables / tokens
        if k.startswith('--'):
            continue
        if k.startswith('-webkit-'):
            continue
        if k in DROP_PROPS_ALWAYS:
            continue
        if k not in KEEP_PROPS:
            continue
        if v in DEFAULT_VALUES:
            continue
        if (k, v) in DEFAULT_PAIRS:
            continue
        # Drop explicit zero values for position offsets that don't matter
        if k in {"top", "right", "bottom", "left"} and v in {"0px", "0"}:
            continue
        # Drop explicit `none` transform
        if k == "transform" and v == "none":
            continue
        out[kebab_to_camel(k)] = v
    return out

def style_obj_to_jsx(style: dict) -> str:
    if not style:
        return ""
    parts = []
    for k, v in style.items():
        # Escape single quotes in value
        vv = v.replace("'", "\\'")
        parts.append(f"{k}: '{vv}'")
    return "{{ " + ", ".join(parts) + " }}"

SELF_CLOSING = {"img", "br", "hr", "input", "meta", "link", "use", "path", "circle", "rect"}

ATTR_RENAME = {
    "class": "className",
    "for": "htmlFor",
    "tabindex": "tabIndex",
    "viewbox": "viewBox",
    "srcset": "srcSet",
    "preserveaspectratio": "preserveAspectRatio",
    "xlink:href": "xlinkHref",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray",
    "stroke-dashoffset": "strokeDashoffset",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stop-color": "stopColor",
    "stop-opacity": "stopOpacity",
}

# Attributes that must ALWAYS carry a value in JSX (never boolean).
FORCE_VALUE_ATTRS = {"alt", "src", "href", "srcSet", "sizes"}

# Extra styles that live in Framer CSS rules (not inline) and must be merged in
# based on the element's data-framer-name.
# These reproduce the `::after` pseudo-border Framer draws on [data-border=true]
# elements via --border-*-width / --border-color CSS vars.
EXTRA_STYLES_BY_NAME = {
    "Cut mat": {
        "borderTop": "3px solid #f2e3cf",
        "borderRight": "2px solid #f2e3cf",
        "borderBottom": "2px solid #f2e3cf",
        "borderLeft": "2px solid #f2e3cf",
    },
    " BG": {
        "borderTop": "1px solid #f2e3cf",
        "borderLeft": "1px solid #f2e3cf",
    },
    "Mat texture": {
        "border": "3px solid #f2e3cf",
        "borderRadius": "21px",
    },
    "numbers": {
        "marginLeft": "16px",
    },
    "About me section": {
        "border": "2px dashed #e35342",
        "borderRadius": "11px",
    },
}

# Drop these noisy attributes Framer adds that React doesn't need.
DROP_ATTRS = {
    "data-framer-background-image-wrapper",
    "data-framer-component-type",
    "data-border",
    "draggable",
    "decoding",
    "crossorigin",
    # Atributos de hidratación de Framer que React no entiende y emite warnings
    "_constraints",
    "parentsize",
    "rotation",
    "shadows",
    "name",
    "data-highlight",
    "data-framer-page-link-current",
    "data-framer-appear-id",
    "data-framer-original-sizes",
}

# Atributos numéricos que deben emitirse como {N} en JSX, no como string
NUMERIC_ATTRS = {"tabIndex"}

def reactify(node, depth=0) -> str:
    # Text node
    if isinstance(node, str):
        text = node.strip()
        if not text:
            return ""
        text = text.replace('{', '{"{"}').replace('}', '{"}"}')
        return text
    # Comments or script/style
    if node.name is None or node.name in ("script", "style"):
        return ""

    # Extra styles from Framer CSS rules, keyed by data-framer-name
    framer_name = node.attrs.get("data-framer-name", "")
    extra = EXTRA_STYLES_BY_NAME.get(framer_name, {})

    # Build attrs
    attrs = []
    style_emitted = False
    for attr, val in node.attrs.items():
        if attr in DROP_ATTRS:
            continue
        jsx_attr = ATTR_RENAME.get(attr, attr)
        if isinstance(val, list):
            val = " ".join(val)
        if attr == "style":
            cleaned = clean_style(val)
            cleaned.update(extra)
            if cleaned:
                attrs.append(f"style={style_obj_to_jsx(cleaned)}")
            style_emitted = True
            continue
        if attr == "class":
            if KEEP_FRAMER_CLASSES:
                # Mantener las clases tal cual — el CSS clonado depende de ellas
                cls = val
            else:
                # Drop Framer-generated hashed classes like framer-xyz123 — keep
                # only meaningful ones (there usually aren't any in seccion.html).
                cls = " ".join(c for c in val.split() if not re.match(r'^(framer-|ssr-variant|hidden-)', c))
            if cls:
                attrs.append(f'className="{cls}"')
            continue
        if '-' in jsx_attr and not jsx_attr.startswith('data-') and not jsx_attr.startswith('aria-'):
            jsx_attr = kebab_to_camel(jsx_attr)
        if val == "" or val is None:
            if jsx_attr in FORCE_VALUE_ATTRS:
                attrs.append(f'{jsx_attr}=""')
            else:
                attrs.append(jsx_attr)
        else:
            if jsx_attr in NUMERIC_ATTRS:
                # tabIndex="0" → tabIndex={0}
                try:
                    attrs.append(f"{jsx_attr}={{{int(val)}}}")
                    continue
                except (TypeError, ValueError):
                    pass
            vs = str(val).replace('"', '&quot;')
            attrs.append(f'{jsx_attr}="{vs}"')

    attrs_str = (" " + " ".join(attrs)) if attrs else ""

    kids = "".join(reactify(c, depth + 1) for c in node.children)

    tag = node.name
    if tag in SELF_CLOSING:
        return f"<{tag}{attrs_str} />"
    return f"<{tag}{attrs_str}>{kids}</{tag}>"


def main():
    with open(HTML_IN, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    if ROOT_SELECTOR:
        # Soporta ".clase" o "tag" como selector simple
        if ROOT_SELECTOR.startswith("."):
            root = soup.find(class_=ROOT_SELECTOR[1:])
        else:
            root = soup.find(ROOT_SELECTOR)
    else:
        root = soup.find("div")
    if not root:
        raise SystemExit(f"No element matching {ROOT_SELECTOR!r} found in {HTML_IN}")

    jsx = reactify(root)

    component = f'''import React from "react";

/**
 * Converted verbatim from {HTML_IN.split("/")[-1]} (Framer export).
 * Only essential CSS props are kept so this file stays editable.
 */
export default function {COMPONENT_NAME}() {{
  return (
    {jsx}
  );
}}
'''
    with open(JSX_OUT, "w", encoding="utf-8") as f:
        f.write(component)

    # Report
    import os
    size = os.path.getsize(JSX_OUT)
    print(f"Wrote {JSX_OUT}")
    print(f"Size: {size:,} bytes ({size / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
