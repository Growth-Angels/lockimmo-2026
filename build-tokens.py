#!/usr/bin/env python3
"""
build-tokens.py — Syncs lockimmo-tokens.json → tokens.css + HTML files

Usage:
  python3 build-tokens.py           # build once
  python3 build-tokens.py --watch   # watch & rebuild on every JSON change
"""

import json, re, sys, time
from pathlib import Path

ROOT        = Path(__file__).parent
TOKEN_FILE  = ROOT / "lockimmo-tokens.json"
CSS_FILE    = ROOT / "tokens.css"
HTML_FILES  = [f for f in ROOT.glob("*.html") if "Standalone" not in f.name]


# ─── Helpers ──────────────────────────────────────────────────────────────────

def shadow_to_css(v):
    if isinstance(v, list):
        return ", ".join(
            f"{s['x']}px {s['y']}px {s['blur']}px {s['spread']}px {s['color']}"
            for s in v
        )
    return f"{v['x']}px {v['y']}px {v['blur']}px {v['spread']}px {v['color']}"


def font_fallback(name):
    low = name.lower()
    if "mono" in low or "jetbrains" in low or "courier" in low:
        return f"'{name}', monospace"
    return f"'{name}', sans-serif"


# ─── CSS generation ───────────────────────────────────────────────────────────

def build_root_block(g, indent="  "):
    lines = [":root {"]

    # — Colors —
    for group in ["brand", "ink", "surface", "success", "error", "info", "purple"]:
        if group not in g:
            continue
        lines.append(f"\n{indent}/* {group.capitalize()} */")
        for k, v in g[group].items():
            lines.append(f"{indent}--{group}-{k}: {v['value']};")

    if "background" in g:
        lines.append(f"\n{indent}/* Background */")
        for k, v in g["background"].items():
            lines.append(f"{indent}--background-{k}: {v['value']};")

    if "border" in g:
        lines.append(f"\n{indent}/* Borders */")
        for k, v in g["border"].items():
            lines.append(f"{indent}--border-{k}: {v['value']};")

    if "tile" in g:
        lines.append(f"\n{indent}/* Tiles */")
        for k, v in g["tile"].items():
            lines.append(f"{indent}--tile-{k}: {v['value']};")

    # — Typography —
    if "fontFamilies" in g:
        lines.append(f"\n{indent}/* Font Families */")
        alias = {"display": "display", "sans": "sans", "mono": "mono"}
        for k, v in g["fontFamilies"].items():
            lines.append(f"{indent}--font-{alias.get(k, k)}: {font_fallback(v['value'])};")

    if "fontWeights" in g:
        lines.append(f"\n{indent}/* Font Weights */")
        for k, v in g["fontWeights"].items():
            lines.append(f"{indent}--font-weight-{k}: {v['value']};")

    if "fontSize" in g:
        lines.append(f"\n{indent}/* Font Sizes */")
        for k, v in g["fontSize"].items():
            lines.append(f"{indent}--font-size-{k}: {v['value']}px;")

    if "lineHeights" in g:
        lines.append(f"\n{indent}/* Line Heights */")
        for k, v in g["lineHeights"].items():
            lines.append(f"{indent}--line-height-{k}: {v['value']};")

    if "letterSpacing" in g:
        lines.append(f"\n{indent}/* Letter Spacing */")
        for k, v in g["letterSpacing"].items():
            lines.append(f"{indent}--letter-spacing-{k}: {v['value']};")

    # — Layout —
    if "spacing" in g:
        lines.append(f"\n{indent}/* Spacing */")
        for k, v in g["spacing"].items():
            lines.append(f"{indent}--spacing-{k}: {v['value']}px;")

    if "borderRadius" in g:
        lines.append(f"\n{indent}/* Border Radius */")
        for k, v in g["borderRadius"].items():
            lines.append(f"{indent}--radius-{k}: {v['value']}px;")

    if "boxShadow" in g:
        lines.append(f"\n{indent}/* Shadows */")
        for k, v in g["boxShadow"].items():
            lines.append(f"{indent}--shadow-{k}: {shadow_to_css(v['value'])};")

    lines.append("\n}")
    return "\n".join(lines)


def build_tokens_css(tokens):
    g = tokens.get("global", {})
    root = build_root_block(g, indent="  ")
    return (
        "/* ================================================================\n"
        "   tokens.css — Auto-generated from lockimmo-tokens.json\n"
        "   DO NOT EDIT MANUALLY — run  python3 build-tokens.py  instead\n"
        "   ================================================================ */\n\n"
        + root + "\n"
    )


# ─── HTML patching ────────────────────────────────────────────────────────────

ROOT_PATTERN = re.compile(r':root\s*\{[^}]*\}', re.DOTALL)


def patch_html(path: Path, tokens: dict):
    """
    1. Replace :root {} block (Design System only)
    2. Replace font-family references (all HTML files)
    3. Replace Google Fonts URL for sans font
    """
    g     = tokens.get("global", {})
    fonts = g.get("fontFamilies", {})
    sans  = fonts.get("sans", {}).get("value", "")

    text = path.read_text(encoding="utf-8")
    original = text
    changed = []

    # 1 — :root replacement (only files that have one)
    if ":root" in text:
        new_root = build_root_block(g, indent="      ")
        text, n = ROOT_PATTERN.subn(new_root, text, count=1)
        if n:
            changed.append(":root updated")

    # 2 — inline font-family strings (CSS & JS)
    old_families = ["Plus Jakarta Sans", "Plus+Jakarta+Sans"]
    for old in old_families:
        if old in text:
            new = sans.replace(" ", "+" if "+" in old else " ")
            text = text.replace(old, new)
            changed.append(f"font '{old}' → '{new}'")

    if text != original:
        path.write_text(text, encoding="utf-8")

    return changed


# ─── Main build ───────────────────────────────────────────────────────────────

def build():
    with open(TOKEN_FILE, encoding="utf-8") as f:
        tokens = json.load(f)

    # 1. Write tokens.css
    CSS_FILE.write_text(build_tokens_css(tokens), encoding="utf-8")
    print(f"  ✓ tokens.css written")

    # 2. Patch HTML files
    for html in HTML_FILES:
        changes = patch_html(html, tokens)
        if changes:
            print(f"  ✓ {html.name}: {', '.join(changes)}")
        else:
            print(f"  · {html.name}: no changes")


def main():
    watch = "--watch" in sys.argv
    print(f"{'👁  Watching' if watch else '🔨 Building'} {TOKEN_FILE.name}…\n")

    last_mtime = None
    while True:
        mtime = TOKEN_FILE.stat().st_mtime
        if mtime != last_mtime:
            try:
                build()
                print(f"\n[{time.strftime('%H:%M:%S')}] Build complete.\n")
                last_mtime = mtime
            except Exception as e:
                import traceback
                print(f"[{time.strftime('%H:%M:%S')}] ✗ Error: {e}")
                traceback.print_exc()

        if not watch:
            break
        time.sleep(1)


if __name__ == "__main__":
    main()
