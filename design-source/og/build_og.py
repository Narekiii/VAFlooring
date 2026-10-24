"""Builds src/app/opengraph-image.jpg (1200x630) from the hero rendering and the logo.
Run from the repository root:  python3 design-source/og/build_og.py
Requires: pip install playwright pillow && python3 -m playwright install chromium
"""
import base64, os, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
hero = ROOT / "src/assets/images/residential-living-room-wide.jpg"
logo = (ROOT / "public/brand/va-flooring-horizontal-reverse.svg").read_text()
serif = base64.b64encode((ROOT / "src/app/fonts/LibreBaskerville-Variable.woff2").read_bytes()).decode()
sans = base64.b64encode((ROOT / "src/app/fonts/Inter-Variable.woff2").read_bytes()).decode()
img = base64.b64encode(hero.read_bytes()).decode()

html = f"""<!doctype html><html><head><style>
@font-face {{ font-family: B; src: url(data:font/woff2;base64,{serif}) format('woff2'); font-weight: 400 700; }}
@font-face {{ font-family: I; src: url(data:font/woff2;base64,{sans}) format('woff2'); font-weight: 100 900; }}
html, body {{ margin: 0; width: 1200px; height: 630px; overflow: hidden; }}
.wrap {{ display: grid; grid-template-columns: 620px 580px; width: 1200px; height: 630px; background: #172B3A; }}
.text {{ display: flex; flex-direction: column; justify-content: space-between; padding: 56px 56px 52px; }}
.logo svg {{ height: 40px; width: auto; display: block; }}
h1 {{ margin: 0; font-family: B; font-weight: 700; font-size: 37px; line-height: 1.14; color: #F7F4EE; letter-spacing: -0.01em; }}
h1 span {{ display: block; }} h1 .o {{ padding-left: 1.2em; }}
.line {{ font-family: I; font-size: 18px; color: #C7A57A; letter-spacing: 0.03em; }}
.photo {{ position: relative; background: url(data:image/jpeg;base64,{img}) 52% 62% / cover no-repeat; }}
.chip {{ position: absolute; left: 16px; bottom: 16px; padding: 3px 8px; background: #F7F4EE; color: #172B3A; font: 500 13px I; border-radius: 2px; }}
</style></head><body><div class="wrap"><div class="text">
<div class="logo">{logo}</div>
<h1><span>Flooring Expertise.</span><span class="o">Family Accountability.</span><span>Since 1999.</span></h1>
<div class="line">Flooring materials and installation in Los Angeles</div>
</div><div class="photo"><span class="chip">Illustrative rendering</span></div></div></body></html>"""

out = ROOT / "src/app/opengraph-image.jpg"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1200, "height": 630})
    pg.set_content(html); pg.wait_for_timeout(300)
    pg.screenshot(path=str(out), type="jpeg", quality=88); b.close()
(ROOT / "src/app/opengraph-image.alt.txt").write_text("V & A Flooring: Flooring Expertise. Family Accountability. Since 1999.")
print("wrote", out)
