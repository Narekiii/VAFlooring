"""V & A Flooring Inc logo system (v2): parquet-pattern mark + Montserrat wordmark.

The mark is a pinwheel of four navy planks around a brass center plank, the way
flooring planks lock around each other. All gaps are equal. The wordmark is outlined
from Montserrat Black (V & A) and SemiBold (FLOORING INC), SIL Open Font License.

Writes every SVG variation, favicons and src/components/brand/logo-paths.ts, then copies
them into the site (skip with --no-install).
"""
import json, os, sys, shutil, pathlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from logo import Font, poly, fmt  # outline + path helpers
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(HERE).parents[1]
OUTDIR = next((a for a in sys.argv[1:] if not a.startswith("--")), os.path.join(HERE, "out"))
os.makedirs(OUTDIR, exist_ok=True)
NAVY, IVORY, BRASS, WHITE = "#172B3A", "#F7F4EE", "#AA8453", "#FFFFFF"
HEAVY = Font(os.path.join(HERE, "Montserrat-900.ttf"))
LIGHT = Font(os.path.join(HERE, "Montserrat-600.ttf"))

# ---- mark geometry: plank thickness T, center plank CW x CH, gap G
T, CW, CH, G = 100.0, 145.0, 100.0, 11.0
MW, MH = T + G + CW + G + T, T + G + CH + G + T


def mark(ox=0.0, oy=0.0, s=1.0):
    x1, x2 = T + G, T + G + CW + G
    y1, y2 = T + G, T + G + CH + G
    planks = [
        [(0, 0), (x2 - G, 0), (x2 - G, T), (0, T)],
        [(x2, 0), (MW, 0), (MW, y2 - G), (x2, y2 - G)],
        [(x1, y2), (MW, y2), (MW, MH), (x1, MH)],
        [(0, y1), (T, y1), (T, MH), (0, MH)],
    ]
    center = [(x1, y1), (x1 + CW, y1), (x1 + CW, y1 + CH), (x1, y1 + CH)]
    t = lambda pts: [(ox + x * s, oy + y * s) for x, y in pts]
    return [poly(t(p)) for p in planks], poly(t(center))


def wordmark(x, base, cap):
    size = cap / HEAVY.cap * HEAVY.upm
    d1, a1, _ = HEAVY.run("V & A", size, x=x, baseline=base)
    x2 = x + a1 + size * 0.32
    d2, a2, _ = LIGHT.run("FLOORING INC", size, tracking=0.02, x=x2, baseline=base)
    return [d1, d2], x2 + a2


def measure(cap):
    _, end = wordmark(0, 0, cap)
    return end


def horizontal():
    cap = MH * 0.32
    gap = MH * 0.16
    words, end = wordmark(MW + gap, MH / 2 + cap / 2, cap)
    planks, center = mark()
    return {"w": end, "h": MH, "planks": planks, "center": center, "words": words}


def stacked():
    cap = 58.0
    tw = measure(cap)
    W = max(tw, MW)
    planks, center = mark(ox=(W - MW) / 2)
    words, _ = wordmark((W - tw) / 2, MH + 48 + cap, cap)
    return {"w": W, "h": MH + 48 + cap, "planks": planks, "center": center, "words": words}


def mark_only():
    planks, center = mark()
    return {"w": MW, "h": MH, "planks": planks, "center": center, "words": []}


def svg_doc(l, main, accent, title, pad=0):
    W, H = l["w"], l["h"]
    parts = [f'<g fill="{main}">' + "".join(f'<path d="{d}"/>' for d in l["planks"] + l["words"]) + "</g>",
             f'<path fill="{accent}" d="{l["center"]}"/>']
    vb = f"{fmt(-pad)} {fmt(-pad)} {fmt(W + 2 * pad)} {fmt(H + 2 * pad)}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>' + "".join(parts) + "</svg>\n")


H_L, S_L, M_L = horizontal(), stacked(), mark_only()
variants = {
    "navy": (NAVY, BRASS),
    "reverse": (IVORY, BRASS),
    "mono-navy": (NAVY, NAVY),
    "mono-white": (WHITE, WHITE),
    "mono-black": ("#000000", "#000000"),
}
for lname, lay, title in (("horizontal", H_L, "V &amp; A Flooring Inc"), ("stacked", S_L, "V &amp; A Flooring Inc"),
                          ("monogram", M_L, "V &amp; A Flooring Inc mark")):
    for vname, (main, acc) in variants.items():
        # one-color versions keep the center plank readable by knocking it out
        lay2 = lay
        if vname.startswith("mono"):
            open(os.path.join(OUTDIR, f"va-flooring-{lname}-{vname}.svg"), "w").write(
                svg_doc(lay2, main, main, title).replace(f'<path fill="{main}" d="{lay["center"]}"/>', ""))
        else:
            open(os.path.join(OUTDIR, f"va-flooring-{lname}-{vname}.svg"), "w").write(svg_doc(lay2, main, acc, title))


def favicon_svg(size=64, radius=10, bg=NAVY, fg=IVORY, accent=BRASS):
    inner = size * 0.74
    s = inner / MW
    ox, oy = (size - MW * s) / 2, (size - MH * s) / 2
    planks, center = mark(ox, oy, s)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
            f'<g fill="{fg}">' + "".join(f'<path d="{d}"/>' for d in planks) + "</g>"
            f'<path fill="{accent}" d="{center}"/></svg>\n')


open(os.path.join(OUTDIR, "favicon.svg"), "w").write(favicon_svg())
open(os.path.join(OUTDIR, "app-icon.svg"), "w").write(favicon_svg(radius=0))


def lay_json(l):
    # Logo.tsx contract: strokes/name in the main color, bar/amp in the accent color.
    return {"width": round(l["w"], 2), "height": round(l["h"], 2), "strokes": l["planks"], "bar": l["center"],
            "name": l["words"], "amp": []}


ts = ("// Generated by design-source/logo/build_logo.py — do not edit by hand.\n"
      "// Wordmark outlined from Montserrat (SIL Open Font License); the parquet mark is original geometry.\n"
      "export type LogoLayout = { width: number; height: number; strokes: string[]; bar: string; name: string[]; amp: string[] };\n"
      f"export const horizontal: LogoLayout = {json.dumps(lay_json(H_L))};\n"
      f"export const stacked: LogoLayout = {json.dumps(lay_json(S_L))};\n"
      f"export const monogram: LogoLayout = {json.dumps(lay_json(M_L))};\n")
open(os.path.join(OUTDIR, "logo-paths.ts"), "w").write(ts)


def raster(pg, svg_text, size, path):
    pg.set_viewport_size({"width": size, "height": size})
    pg.set_content(f'<html><body style="margin:0;background:transparent">{svg_text.replace("<svg ", f"<svg width={size} height={size} ", 1)}</body></html>')
    pg.screenshot(path=path, omit_background=True, clip={"x": 0, "y": 0, "width": size, "height": size})


with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    for s in (16, 32, 48):
        raster(pg, favicon_svg(), s, os.path.join(OUTDIR, f"favicon-{s}.png"))
    for s, n in ((180, "apple-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
        raster(pg, favicon_svg(radius=0), s, os.path.join(OUTDIR, n))
    b.close()
from PIL import Image
imgs = [Image.open(os.path.join(OUTDIR, f"favicon-{s}.png")).convert("RGBA") for s in (16, 32, 48)]
imgs[2].save(os.path.join(OUTDIR, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:2])

if "--no-install" not in sys.argv:
    for f in os.listdir(OUTDIR):
        if (f.startswith("va-flooring-") and f.endswith(".svg")) or f in ("icon-192.png", "icon-512.png"):
            shutil.copy(os.path.join(OUTDIR, f), ROOT / "public/brand" / f)
    shutil.copy(os.path.join(OUTDIR, "favicon.ico"), ROOT / "src/app/favicon.ico")
    shutil.copy(os.path.join(OUTDIR, "favicon.svg"), ROOT / "src/app/icon.svg")
    shutil.copy(os.path.join(OUTDIR, "apple-icon.png"), ROOT / "src/app/apple-icon.png")
    shutil.copy(os.path.join(OUTDIR, "logo-paths.ts"), ROOT / "src/components/brand/logo-paths.ts")
    print("installed into public/brand, src/app and src/components/brand")
print("horizontal", round(H_L["w"]), "x", round(H_L["h"]), "| stacked", round(S_L["w"]), "x", round(S_L["h"]))
