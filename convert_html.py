import json
import re
from bs4 import BeautifulSoup
import os

html_file = "/home/jos/Documentos/jackiezhang-backup/jackiezhang.co.za/index.html"
css_out = "/home/jos/root/bookforce/pf-2026/src/framer.css"
jsx_out = "/home/jos/root/bookforce/pf-2026/src/components/FramerContent.tsx"

with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# 1. Extract CSS
styles = soup.find_all('style')
css_content = ""
for s in styles:
    if s.string:
        css_content += s.string + "\n"

with open(css_out, 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. Extract DOM
main_div = soup.find(id="main")
if not main_div:
    print("Could not find #main in HTML")
    exit(1)

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
            # Convert key to camelCase (except custom properties --var)
            if key.startswith('--'):
                style_obj[key] = val
            else:
                camel_key = kebab_to_camel(key)
                # Ensure the value is properly escaped, but we'll do that when generating the dict string
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
        # Escape curly braces inside text
        text = text.replace('{', '{{').replace('}', '}}')
        return text

    if node.name in ['script', 'style']:
        return ""

    if node.name is None:
        return "" # Comments

    # Certain tags are self-closing in JSX
    self_closing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'use']
    
    attrs_str = ""
    for attr, val in node.attrs.items():
        # Handle class -> className
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
        elif attr == 'aria-hidden':
            jsx_attr = 'aria-hidden'
        elif attr == 'transform':
            # This is tricky because it might be SVG transform which is string in React usually
            pass
        elif attr == 'fill-rule':
            jsx_attr = 'fillRule'
        elif attr == 'clip-rule':
            jsx_attr = 'clipRule'
        elif attr == 'stroke-width':
            jsx_attr = 'strokeWidth'
        elif attr == 'stroke-linecap':
            jsx_attr = 'strokeLinecap'
        elif attr == 'stroke-linejoin':
            jsx_attr = 'strokeLinejoin'
        elif attr == 'stroke-dasharray':
            jsx_attr = 'strokeDasharray'
        elif attr == 'stroke-dashoffset':
            jsx_attr = 'strokeDashoffset'

        # other dash cases in svg
        if '-' in jsx_attr and not jsx_attr.startswith('data-') and not jsx_attr.startswith('aria-'):
            jsx_attr = kebab_to_camel(jsx_attr)

        if isinstance(val, list):
            val = " ".join(val)
        
        # some attributes are boolean in html
        if val == "":
            attrs_str += f" {jsx_attr}"
        else:
            # Escape quotes
            val_str = str(val).replace('"', '&quot;')
            attrs_str += f' {jsx_attr}="{val_str}"'

    children_str = "".join(reactify(child) for child in node.children)
    
    if node.name in self_closing:
        return f"<{node.name}{attrs_str} />"
    else:
        return f"<{node.name}{attrs_str}>{children_str}</{node.name}>"

jsx_str = reactify(main_div)

react_file_content = f"""import React from 'react';
import '../framer.css';

export default function FramerContent() {{
  return (
    {jsx_str}
  );
}}
"""

with open(jsx_out, 'w', encoding='utf-8') as f:
    f.write(react_file_content)

print("Successfully converted HTML to JSX!")
