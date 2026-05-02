import json
import re
from bs4 import BeautifulSoup
import os

html_file = "/home/jos/josbert.dev/pf-2026/seccion.html"
css_out = "/home/jos/josbert.dev/pf-2026/src/framer-header.css"
jsx_out = "/home/jos/josbert.dev/pf-2026/src/components/FramerHeader.tsx"

with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

def kebab_to_camel(string):
    parts = string.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def parse_style(style_str):
    rules = [r.strip() for r in style_str.split(';') if r.strip()]
    style_obj = {}
    for rule in rules:
        if ':' in rule:
            parts = rule.split(':', 1)
            key = parts[0].strip()
            val = parts[1].strip()
            if key.startswith('--'):
                style_obj[key] = val
            else:
                camel_key = kebab_to_camel(key)
                style_obj[camel_key] = val
    return style_obj

def format_style_obj(style_obj):
    items = []
    for k, v in style_obj.items():
        if k.startswith('--'):
            items.append(f"'{k}': '{v}'")
        else:
            items.append(f"{k}: '{v}'")
    return "{{ " + ", ".join(items) + " }}"

def reactify(node):
    if isinstance(node, str):
        text = node.strip()
        if not text:
            return ""
        text = text.replace('{', '{{').replace('}', '}}')
        return text

    if node.name in ['script', 'style']:
        return ""

    if node.name is None:
        return ""

    self_closing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'use']
    
    attrs_str = ""
    for attr, val in node.attrs.items():
        jsx_attr = attr
        if attr == 'class':
            jsx_attr = 'className'
            if isinstance(val, list):
                val = " ".join(val)
        elif attr == 'for':
            jsx_attr = 'htmlFor'
        elif attr == 'style':
            val = format_style_obj(parse_style(val))
            attrs_str += f" {jsx_attr}={val}"
            continue
        elif attr == 'tabindex':
            jsx_attr = 'tabIndex'
        elif attr == 'viewbox':
            jsx_attr = 'viewBox'
        # Dash cases
        elif '-' in jsx_attr and not jsx_attr.startswith('data-') and not jsx_attr.startswith('aria-'):
            jsx_attr = kebab_to_camel(jsx_attr)

        if isinstance(val, list):
            val = " ".join(val)
        
        if val == "":
            attrs_str += f" {jsx_attr}"
        else:
            val_str = str(val).replace('"', '&quot;')
            attrs_str += f' {jsx_attr}="{val_str}"'

    children_str = "".join(reactify(child) for child in node.children)
    
    if node.name in self_closing:
        return f"<{node.name}{attrs_str} />"
    else:
        return f"<{node.name}{attrs_str}>{children_str}</{node.name}>"

# Find first div (the component root)
main_div = soup.find('div')

if not main_div:
    print("Could not find a div in HTML")
    exit(1)

jsx_str = reactify(main_div)

react_file_content = f"""import React from 'react';

export default function FramerHeader() {{
  return (
    {jsx_str}
  );
}}
"""

with open(jsx_out, 'w', encoding='utf-8') as f:
    f.write(react_file_content)

print(f"Successfully converted HTML to {jsx_out}")
