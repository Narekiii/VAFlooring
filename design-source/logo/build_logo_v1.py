"""Build final V & A Flooring logo assets (SVG + PNG/ICO) and a TS module with path data."""
from logo import *
import json, os, io
from playwright.sync_api import sync_playwright

import shutil, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUTDIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
os.makedirs(OUTDIR, exist_ok=True)

M = monogram(Wt=23, Wn=12.5, bar_y=(56.0, 67.0))
MW, MH = M["width"], M["height"]
AMP_SCALE = 0.72


def word_one_line(x, base, cap):
    size = cap / SERIF_B.cap * SERIF_B.upm
    dV, aV, _ = SERIF_B.run("V", size, x=x, baseline=base)
    x2 = x + aV + size * 0.17
    dAmp, aAmp, bAmp = SERIF_R.run("&", size * AMP_SCALE, x=x2, baseline=base)
    x3 = x2 + aAmp + size * 0.17
    dA, aA, _ = SERIF_B.run("A", size, x=x3, baseline=base)
    x4 = x3 + aA + size * 0.40
    dF, aF, _ = SERIF_B.run("FLOORING", size, tracking=0.055, x=x4, baseline=base)
    return {"name": [dV, dA, dF], "amp": [dAmp]}, x4 + aF


def horizontal():
    cap = 35.0
    gap = 27.0
    word, end = word_one_line(MW + gap, base=50 + cap / 2, cap=cap)
    return {"mono": (0.0, 0.0, 1.0), "word": word, "w": end, "h": MH}


def stacked():
    # monogram centered over two lines: "V & A" and "FLOORING"
    cap1, cap2 = 40.0, 17.0
    size1 = cap1 / SERIF_B.cap * SERIF_B.upm
    # measure line 1
    _, aV, _ = SERIF_B.run("V", size1)
    _, aAmp, _ = SERIF_R.run("&", size1 * AMP_SCALE)
    _, aA, _ = SERIF_B.run("A", size1)
    sp = size1 * 0.2
    w1 = aV + sp + aAmp + sp + aA
    size2 = cap2 / SERIF_B.cap * SERIF_B.upm
    tr2 = 0.32
    _, aF, _ = SERIF_B.run("FLOORING", size2, tracking=tr2)
    W = max(w1, aF, MW * 1.0) + 0
    W = max(W, 230)
    ms = 1.0
    mono_x = (W - MW * ms) / 2
    y1 = MH * ms + 30 + cap1
    x = (W - w1) / 2
    dV, _, _ = SERIF_B.run("V", size1, x=x, baseline=y1)
    dAmp, _, _ = SERIF_R.run("&", size1 * AMP_SCALE, x=x + aV + sp, baseline=y1)
    dA, _, _ = SERIF_B.run("A", size1, x=x + aV + sp + aAmp + sp, baseline=y1)
    y2 = y1 + 16 + cap2
    # tracking adds trailing space visually; centre the ink
    dF, aF2, bF = SERIF_B.run("FLOORING", size2, tracking=tr2, x=0, baseline=y2)
    ink_w = bF[2] - bF[0]
    xf = (W - ink_w) / 2 - bF[0]
    dF, _, _ = SERIF_B.run("FLOORING", size2, tracking=tr2, x=xf, baseline=y2)
    return {"mono": (mono_x, 0.0, ms), "word": {"name": [dV, dA, dF], "amp": [dAmp]}, "w": W, "h": y2}


def mono_parts(ox, oy, s):
    t = lambda pts: [(ox + x * s, oy + y * s) for x, y in pts]
    return {"strokes": [poly(t(M[p])) for p in ("v_left", "shared", "a_right")], "bar": poly(t(M["bar"]))}


def svg_doc(layout, main, accent, amp, title, pad=0, bg=None):
    W, H = layout["w"], layout["h"]
    ox, oy, s = layout["mono"]
    mp = mono_parts(ox, oy, s)
    parts = []
    if bg:
        parts.append(f'<rect x="{fmt(-pad)}" y="{fmt(-pad)}" width="{fmt(W + 2 * pad)}" height="{fmt(H + 2 * pad)}" fill="{bg}"/>')
    parts.append(f'<g fill="{main}">' + "".join(f'<path d="{d}"/>' for d in mp["strokes"]) + "</g>")
    parts.append(f'<path fill="{accent}" d="{mp["bar"]}"/>')
    if layout.get("word"):
        parts.append(f'<g fill="{main}">' + "".join(f'<path d="{d}"/>' for d in layout["word"]["name"]) + "</g>")
        parts.append(f'<g fill="{amp}">' + "".join(f'<path d="{d}"/>' for d in layout["word"]["amp"]) + "</g>")
    vb = f"{fmt(-pad)} {fmt(-pad)} {fmt(W + 2 * pad)} {fmt(H + 2 * pad)}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>' + "".join(parts) + "</svg>\n")


H_L, S_L = horizontal(), stacked()
MONO_L = {"mono": (0.0, 0.0, 1.0), "word": None, "w": MW, "h": MH}

variants = {
    "navy": (NAVY, BRASS, BRASS, None),       # for light backgrounds
    "reverse": (IVORY, BRASS, BRASS, None),   # for dark backgrounds
    "mono-navy": (NAVY, NAVY, NAVY, None),    # single color
    "mono-white": (WHITE, WHITE, WHITE, None),
    "mono-black": ("#000000", "#000000", "#000000", None),
}
files = []
for lname, lay, title in (("horizontal", H_L, "V &amp; A Flooring"), ("stacked", S_L, "V &amp; A Flooring"), ("monogram", MONO_L, "V &amp; A Flooring monogram")):
    for vname, (main, acc, amp, bg) in variants.items():
        fn = f"va-flooring-{lname}-{vname}.svg"
        pad = 0
        open(os.path.join(OUTDIR, fn), "w").write(svg_doc(lay, main, acc, amp, title, pad=pad, bg=bg))
        files.append(fn)

# favicon: monogram, single color ivory on navy tile, generous padding
def favicon_svg(size=64, radius=10, bg=NAVY, fg=IVORY, accent=None):
    inner = size * 0.64
    s = inner / MH
    w = MW * s
    ox, oy = (size - w) / 2, (size - inner) / 2
    mp = mono_parts(ox, oy, s)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
            f'<g fill="{fg}">' + "".join(f'<path d="{d}"/>' for d in mp["strokes"]) + "</g>"
            f'<path fill="{accent or fg}" d="{mp["bar"]}"/></svg>\n')

open(os.path.join(OUTDIR, "favicon.svg"), "w").write(favicon_svg())
open(os.path.join(OUTDIR, "app-icon.svg"), "w").write(favicon_svg(radius=0, accent=BRASS))

# TS module for inline React rendering
def lay_json(l):
    ox, oy, s = l["mono"]
    mp = mono_parts(ox, oy, s)
    return {"width": round(l["w"], 2), "height": round(l["h"], 2), "strokes": mp["strokes"], "bar": mp["bar"],
            "name": l["word"]["name"] if l.get("word") else [], "amp": l["word"]["amp"] if l.get("word") else []}

ts = ("// Generated by brand/build_logo.py — do not edit by hand.\n"
      "// Outlined from Libre Baskerville (SIL Open Font License); monogram is original geometry.\n"
      "export type LogoLayout = { width: number; height: number; strokes: string[]; bar: string; name: string[]; amp: string[] };\n"
      f"export const horizontal: LogoLayout = {json.dumps(lay_json(H_L))};\n"
      f"export const stacked: LogoLayout = {json.dumps(lay_json(S_L))};\n"
      f"export const monogram: LogoLayout = {json.dumps(lay_json(MONO_L))};\n")
open(os.path.join(OUTDIR, "logo-paths.ts"), "w").write(ts)

# rasterise favicons/app icons with Chromium
def raster(svg_text, size, path):
    html = f'<html><body style="margin:0;background:transparent">{svg_text.replace("<svg ", f"<svg width={size} height={size} ")}</body></html>'
    pg.set_viewport_size({"width": size, "height": size})
    pg.set_content(html)
    pg.screenshot(path=path, omit_background=True, clip={"x": 0, "y": 0, "width": size, "height": size})

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    fav = favicon_svg()
    raster(fav, 32, os.path.join(OUTDIR, "favicon-32.png"))
    raster(fav, 16, os.path.join(OUTDIR, "favicon-16.png"))
    raster(fav, 48, os.path.join(OUTDIR, "favicon-48.png"))
    raster(favicon_svg(radius=0, accent=BRASS), 180, os.path.join(OUTDIR, "apple-icon.png"))
    raster(favicon_svg(radius=0, accent=BRASS), 192, os.path.join(OUTDIR, "icon-192.png"))
    raster(favicon_svg(radius=0, accent=BRASS), 512, os.path.join(OUTDIR, "icon-512.png"))
    b.close()
from PIL import Image
imgs = [Image.open(os.path.join(OUTDIR, f"favicon-{s}.png")).convert("RGBA") for s in (16, 32, 48)]
imgs[2].save(os.path.join(OUTDIR, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:2])
print("built", len(files), "svgs; horizontal", round(H_L["w"]), "x", H_L["h"], "stacked", round(S_L["w"]), "x", round(S_L["h"]))

# Copy results into the site (skip with --no-install)
if "--no-install" not in sys.argv:
    for f in os.listdir(OUTDIR):
        src = os.path.join(OUTDIR, f)
        if f.endswith(".svg") and f.startswith("va-flooring-") or f in ("icon-192.png", "icon-512.png"):
            shutil.copy(src, ROOT / "public/brand" / f)
    shutil.copy(os.path.join(OUTDIR, "favicon.ico"), ROOT / "src/app/favicon.ico")
    shutil.copy(os.path.join(OUTDIR, "favicon.svg"), ROOT / "src/app/icon.svg")
    shutil.copy(os.path.join(OUTDIR, "apple-icon.png"), ROOT / "src/app/apple-icon.png")
    shutil.copy(os.path.join(OUTDIR, "logo-paths.ts"), ROOT / "src/components/brand/logo-paths.ts")
    print("installed logo files into public/brand, src/app and src/components/brand")
