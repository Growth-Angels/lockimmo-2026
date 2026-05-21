#!/usr/bin/env python3
"""
sync-to-json.py — Reads :root {} from LOCKimmo Design System.html
                   and updates values in lockimmo-tokens.json

Run on demand:  python3 sync-to-json.py
"""

import json, re
from pathlib import Path
from copy import deepcopy

ROOT        = Path(__file__).parent
HTML_FILE   = ROOT / "LOCKimmo Design System.html"
TOKEN_FILE  = ROOT / "lockimmo-tokens.json"


# ─── Parse :root {} from HTML ─────────────────────────────────────────────────

def parse_css_vars(html_text):
    """Extract all --var: value; declarations from the first :root {} block."""
    match = re.search(r':root\s*\{([^}]*)\}', html_text, re.DOTALL)
    if not match:
        raise ValueError(":root {} block not found in Design System HTML")

    vars = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line.startswith("--"):
            continue
        m = re.match(r'--([\w-]+)\s*:\s*(.+?)\s*;', line)
        if m:
            vars[m.group(1)] = m.group(2).strip()
    return vars


# ─── Value cleaners ───────────────────────────────────────────────────────────

def strip_px(v):
    return v.replace("px", "").strip()

def strip_font_fallback(v):
    """'Alan Sans', sans-serif  →  Alan Sans"""
    v = v.strip()
    first = v.split(",")[0].strip()
    return first.strip("'\"")

def parse_shadow(css_val):
    """
    Parse one or more CSS box-shadow values back to the token object format.
    Handles:  0px 1px 3px 0px rgba(...)  and comma-separated lists.
    """
    def parse_one(s):
        s = s.strip()
        # Match: x y blur spread color
        m = re.match(
            r'(-?[\d.]+px)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(rgba?\([^)]+\)|#[\da-fA-F]+)',
            s
        )
        if not m:
            return None
        def num(px): return px.replace("px","")
        return {
            "x":      num(m.group(1)),
            "y":      num(m.group(2)),
            "blur":   num(m.group(3)),
            "spread": num(m.group(4)),
            "color":  m.group(5),
            "type":   "dropShadow"
        }

    # Split on ", " but not inside parentheses (rgba)
    parts = re.split(r',\s*(?![^()]*\))', css_val)
    parsed = [parse_one(p) for p in parts if p.strip()]
    parsed = [p for p in parsed if p is not None]

    if not parsed:
        return None
    return parsed if len(parsed) > 1 else parsed[0]


# ─── CSS var → JSON path mapping ──────────────────────────────────────────────

def css_vars_to_token_updates(vars):
    """
    Returns a list of (json_path_tuple, new_value) to apply to the token file.
    json_path_tuple: keys to navigate the JSON, e.g. ("global","brand","500","value")
    """
    updates = []

    for name, raw in vars.items():
        parts = name.split("-")

        # Colors: --brand-500, --ink-800, --surface-100, --background-page, etc.
        if parts[0] in ("brand","ink","surface","success","error","info","purple","border","tile","background") and len(parts) >= 2:
            group = parts[0]
            key   = "-".join(parts[1:])
            updates.append((("global", group, key, "value"), raw))

        # Font families: --font-display, --font-sans, --font-mono
        elif name in ("font-display", "font-sans", "font-mono"):
            alias = {"font-display": "display", "font-sans": "sans", "font-mono": "mono"}
            updates.append((("global", "fontFamilies", alias[name], "value"), strip_font_fallback(raw)))

        # Font weights: --font-weight-regular, --font-weight-bold, etc.
        elif name.startswith("font-weight-"):
            key = name[len("font-weight-"):]
            updates.append((("global", "fontWeights", key, "value"), raw))

        # Font sizes: --font-size-xs, --font-size-2xl, etc.
        elif name.startswith("font-size-"):
            key = name[len("font-size-"):]
            updates.append((("global", "fontSize", key, "value"), strip_px(raw)))

        # Line heights: --line-height-tight, etc.
        elif name.startswith("line-height-"):
            key = name[len("line-height-"):]
            updates.append((("global", "lineHeights", key, "value"), raw))

        # Letter spacing: --letter-spacing-tight, etc.
        elif name.startswith("letter-spacing-"):
            key = name[len("letter-spacing-"):]
            updates.append((("global", "letterSpacing", key, "value"), raw))

        # Spacing: --spacing-1, etc.
        elif name.startswith("spacing-"):
            key = name[len("spacing-"):]
            updates.append((("global", "spacing", key, "value"), strip_px(raw)))

        # Border radius: --radius-sm, --radius-pill, etc.
        elif name.startswith("radius-"):
            key = name[len("radius-"):]
            updates.append((("global", "borderRadius", key, "value"), strip_px(raw)))

        # Shadows: --shadow-card, --shadow-hover, etc.
        elif name.startswith("shadow-"):
            key = name[len("shadow-"):]
            parsed = parse_shadow(raw)
            if parsed is not None:
                updates.append((("global", "boxShadow", key, "value"), parsed))
            # if parsing fails, skip (keep existing value)

    return updates


# ─── Apply updates to token dict ──────────────────────────────────────────────

def set_nested(d, path, value):
    """Set d[path[0]][path[1]]...[path[-1]] = value, only if path exists."""
    cur = d
    for key in path[:-1]:
        if key not in cur:
            return False
        cur = cur[key]
    leaf = path[-1]
    if leaf not in cur:
        return False
    cur[leaf] = value
    return True


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"📖 Reading {HTML_FILE.name}…")
    html = HTML_FILE.read_text(encoding="utf-8")
    css_vars = parse_css_vars(html)
    print(f"   {len(css_vars)} CSS variables found in :root")

    print(f"📖 Loading {TOKEN_FILE.name}…")
    with open(TOKEN_FILE, encoding="utf-8") as f:
        tokens = json.load(f)

    updates = css_vars_to_token_updates(css_vars)

    applied, skipped = 0, 0
    for path, value in updates:
        if set_nested(tokens, path, value):
            applied += 1
        else:
            skipped += 1

    print(f"   {applied} values updated  /  {skipped} skipped (path not in JSON)")

    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n✅ {TOKEN_FILE.name} updated.\n")


if __name__ == "__main__":
    main()
