"""Builds docs/brand-reference.html — a self-contained brand reference (logos, color, type).
Run from the repository root:  python3 design-source/logo/build_brand_reference.py
"""
import base64, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
B = ROOT / "public/brand"
_n = [0]


def svg(n):
    _n[0] += 1
    t = (B / n).read_text()
    return t.replace('id="t"', f'id="t{_n[0]}"').replace('aria-labelledby="t"', f'aria-labelledby="t{_n[0]}"')
fav = (ROOT / "src/app/icon.svg").read_text()
serif = base64.b64encode((ROOT / "src/app/fonts/LibreBaskerville-Variable.woff2").read_bytes()).decode()
sans = base64.b64encode((ROOT / "src/app/fonts/Inter-Variable.woff2").read_bytes()).decode()


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def cr(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


colors = [
    ("Foundation Navy", "#172B3A", "Headings, navigation, footer, dark sections", "#F7F4EE"),
    ("Warm Ivory", "#F7F4EE", "Primary page background", "#172B3A"),
    ("White", "#FFFFFF", "Alternate background, form fields", "#172B3A"),
    ("Natural Sand", "#E6DED1", "Alternate sections, quiet surfaces", "#172B3A"),
    ("Muted Brass", "#AA8453", "Decorative accent only: rules, logo crossbar", "#172B3A"),
    ("Deep Bronze", "#75552F", "Primary buttons with white text, small serif accents", "#FFFFFF"),
    ("Graphite", "#303538", "Body text", "#FFFFFF"),
]
derived = [
    ("Bronze, pressed", "#5E4424", "Primary button hover"),
    ("Ink, soft", "#4A5A66", "Secondary text on light backgrounds"),
    ("Brass, light", "#C7A57A", "Small accent text on navy"),
]
pairs = [
    ("Navy on Ivory", "#172B3A", "#F7F4EE", "Headings"),
    ("Graphite on Ivory", "#303538", "#F7F4EE", "Body text"),
    ("White on Deep Bronze", "#FFFFFF", "#75552F", "Primary button"),
    ("Ivory on Navy", "#F7F4EE", "#172B3A", "Text on dark sections"),
    ("Navy on Sand", "#172B3A", "#E6DED1", "Text on sand sections"),
    ("Brass on Ivory", "#AA8453", "#F7F4EE", "Not for text"),
]


def sw(name, hx, role, fg):
    r, g, b = (int(hx[i:i + 2], 16) for i in (1, 3, 5))
    return (f'<div class="sw"><div class="chip" style="background:{hx};color:{fg}">{hx}</div>'
            f'<div class="meta"><strong>{name}</strong><span>RGB {r} {g} {b}</span><span>{role}</span></div></div>')


def pair(label, fg, bg, use):
    ratio = cr(fg, bg)
    verdict = "AA, all text" if ratio >= 4.5 else ("AA large text and graphics only" if ratio >= 3 else "Fails")
    if use == "Not for text":
        verdict = "Decorative only"
    return (f'<tr><td><span class="pp" style="background:{bg};color:{fg}">Aa</span></td><td>{label}</td>'
            f'<td>{ratio:.1f}:1</td><td>{verdict}</td><td>{use}</td></tr>')


html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>V &amp; A Flooring Brand Reference</title>
<style>
@font-face {{ font-family: "Libre Baskerville"; src: url(data:font/woff2;base64,{serif}) format("woff2"); font-weight: 400 700; }}
@font-face {{ font-family: "Inter"; src: url(data:font/woff2;base64,{sans}) format("woff2"); font-weight: 100 900; }}
:root {{ --navy:#172B3A; --ivory:#F7F4EE; --sand:#E6DED1; --brass:#AA8453; --bronze:#75552F; --graphite:#303538; --soft:#4A5A66; --line:#D9CFBF; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--ivory); color: var(--graphite); font: 16px/1.6 Inter, Arial, sans-serif; }}
main {{ max-width: 1120px; margin: 0 auto; padding: 56px 24px 96px; }}
h1, h2, h3 {{ color: var(--navy); font-family: "Libre Baskerville", Georgia, serif; margin: 0; }}
h1 {{ font-size: 40px; line-height: 1.15; }}
h2 {{ font-size: 26px; margin: 72px 0 8px; padding-top: 24px; border-top: 1px solid var(--navy); }}
h3 {{ font-size: 18px; margin: 32px 0 12px; }}
p {{ max-width: 680px; margin: 8px 0 0; }}
.lede {{ font-size: 18px; color: var(--soft); }}
.grid {{ display: grid; gap: 16px; }}
.g2 {{ grid-template-columns: repeat(2, minmax(0,1fr)); }} .g3 {{ grid-template-columns: repeat(3, minmax(0,1fr)); }}
.tile {{ display: flex; align-items: center; justify-content: center; min-height: 180px; padding: 32px; }}
.tile svg {{ max-width: 100%; height: auto; }}
.cap {{ font-size: 13px; color: var(--soft); margin-top: 8px; }}
.hl svg {{ width: 360px; }} .st svg {{ width: 180px; }} .mo svg {{ width: 110px; }}
.sw {{ display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); }}
.chip {{ height: 72px; display: flex; align-items: flex-end; padding: 8px 10px; font: 600 13px Inter; border: 1px solid rgba(0,0,0,.08); }}
.meta {{ display: grid; font-size: 14px; }} .meta strong {{ color: var(--navy); }} .meta span {{ color: var(--soft); }}
table {{ border-collapse: collapse; width: 100%; font-size: 14px; margin-top: 12px; }}
td, th {{ text-align: left; padding: 10px 12px 10px 0; border-bottom: 1px solid var(--line); vertical-align: middle; }}
th {{ color: var(--soft); font-weight: 500; }}
.pp {{ display: inline-flex; width: 44px; height: 32px; align-items: center; justify-content: center; font: 700 16px "Libre Baskerville"; border: 1px solid rgba(0,0,0,.08); }}
.type {{ padding: 24px 0; border-bottom: 1px solid var(--line); }}
.sizes {{ display: flex; gap: 28px; align-items: end; flex-wrap: wrap; }}
.sizes div {{ text-align: center; font-size: 12px; color: var(--soft); }}
.sizes svg {{ display: block; margin: 0 auto 6px; }}
ul {{ padding-left: 20px; }} li {{ margin: 4px 0; }}
.do li::marker {{ content: "✓  "; color: #2f5d3a; }} .dont li::marker {{ content: "✕  "; color: #9c2f23; }}
code {{ font-size: 13px; background: #fff; padding: 1px 5px; border: 1px solid var(--line); }}
@media (max-width: 760px) {{ .g2, .g3 {{ grid-template-columns: 1fr; }} h1 {{ font-size: 32px; }} }}
</style></head><body><main>
<h1>V &amp; A Flooring<br>Brand Reference</h1>
<p class="lede">Logo system, color and typography for the V &amp; A Flooring website and related materials. The identity is meant to feel established, architectural and approachable: confident navy type on warm, light grounds, with brass used sparingly.</p>

<h2>Logo</h2>
<p>The monogram joins a V and an A through one shared stroke. Strokes follow classic serif contrast: the two heavy down-strokes are thick, and the shared up-stroke is thin, so it reads correctly as part of both letters. Every terminal is cut flat and aligned to two horizontal lines, like plank ends on a floor, and the A’s crossbar is a single short plank in brass. The wordmark is set in Libre Baskerville Bold with a smaller, lighter ampersand.</p>

<h3>Primary horizontal</h3>
<div class="grid g2">
  <div><div class="tile hl" style="background:#F7F4EE;border:1px solid var(--line)">{svg("va-flooring-horizontal-navy.svg")}</div><div class="cap">Navy, for light backgrounds · <code>va-flooring-horizontal-navy.svg</code></div></div>
  <div><div class="tile hl" style="background:#172B3A">{svg("va-flooring-horizontal-reverse.svg")}</div><div class="cap">Ivory, for dark backgrounds · <code>va-flooring-horizontal-reverse.svg</code></div></div>
</div>

<h3>Stacked</h3>
<div class="grid g3">
  <div><div class="tile st" style="background:#F7F4EE;border:1px solid var(--line)">{svg("va-flooring-stacked-navy.svg")}</div><div class="cap"><code>va-flooring-stacked-navy.svg</code></div></div>
  <div><div class="tile st" style="background:#172B3A">{svg("va-flooring-stacked-reverse.svg")}</div><div class="cap"><code>va-flooring-stacked-reverse.svg</code></div></div>
  <div><div class="tile st" style="background:#E6DED1">{svg("va-flooring-stacked-mono-navy.svg")}</div><div class="cap">Single color · <code>va-flooring-stacked-mono-navy.svg</code></div></div>
</div>

<h3>Monogram and single-color versions</h3>
<div class="grid g3">
  <div><div class="tile mo" style="background:#FFFFFF;border:1px solid var(--line)">{svg("va-flooring-monogram-navy.svg")}</div><div class="cap"><code>va-flooring-monogram-navy.svg</code></div></div>
  <div><div class="tile mo" style="background:#75552F">{svg("va-flooring-monogram-mono-white.svg")}</div><div class="cap">White single color · <code>va-flooring-monogram-mono-white.svg</code></div></div>
  <div><div class="tile hl" style="background:#FFFFFF;border:1px solid var(--line)">{svg("va-flooring-horizontal-mono-black.svg")}</div><div class="cap">Black single color, for one-color print · <code>va-flooring-horizontal-mono-black.svg</code></div></div>
</div>

<h3>Favicon and small sizes</h3>
<div class="sizes">
  <div><div style="width:64px">{fav}</div>64 px</div>
  <div><div style="width:32px">{fav}</div>32 px</div>
  <div><div style="width:16px">{fav}</div>16 px</div>
  <div><div style="width:48px">{svg("va-flooring-monogram-mono-navy.svg")}</div>Monogram, 48 px</div>
  <div><div style="width:150px">{svg("va-flooring-horizontal-mono-navy.svg")}</div>Horizontal, 150 px minimum</div>
</div>
<p>Below 32 px, use the single-color monogram so the crossbar stays visible. Keep the horizontal logo at least 150 px (1.25 in) wide and the stacked logo at least 90 px wide. Keep clear space around any version equal to the width of one thick monogram stroke.</p>

<h3>Supporting line</h3>
<p style="font:500 15px Inter;letter-spacing:.04em;color:#75552F">Family Owned • Since 1999</p>
<p>Set separately from the logo, never locked inside it.</p>

<div class="grid g2" style="margin-top:24px">
<div><h3>Do</h3><ul class="do"><li>Use the navy logo on ivory, white or sand.</li><li>Use the ivory logo on navy or on calm, dark photography.</li><li>Use the single-color versions for embroidery, stamps and one-color print.</li></ul></div>
<div><h3>Don’t</h3><ul class="dont"><li>Recolor, stretch, outline or add effects.</li><li>Rebuild the wordmark in another typeface or enlarge the ampersand.</li><li>Place the full-color logo on busy photography.</li><li>Combine it with Lowe’s or manufacturer logos.</li></ul></div>
</div>

<h2>Color</h2>
<p>Warm ivory and white carry most pages. Navy anchors type, navigation and the footer; sand marks alternate sections. Brass is a small decorative accent; deep bronze is reserved for primary buttons.</p>
<div style="margin-top:16px">{''.join(sw(*c) for c in colors)}</div>
<h3>Derived tones</h3>
<p>Tints and shades of the palette used where contrast requires them.</p>
<div>{''.join(sw(n, h, r, "#FFFFFF" if lum(h) < 0.3 else "#172B3A") for n, h, r in derived)}</div>
<h3>Contrast (WCAG 2.2)</h3>
<table><tr><th></th><th>Pair</th><th>Ratio</th><th>Result</th><th>Use</th></tr>{''.join(pair(*p) for p in pairs)}</table>

<h2>Typography</h2>
<div class="type"><div style="font:700 44px/1.1 'Libre Baskerville';color:#172B3A">Flooring Expertise.</div>
<p class="cap">Libre Baskerville Bold · headings and major statements · SIL Open Font License</p></div>
<div class="type"><div style="font:400 26px/1.35 'Libre Baskerville';color:#75552F">For the spaces you call home.</div>
<p class="cap">Libre Baskerville Regular · page subtitles and short accent lines</p></div>
<div class="type"><div style="font:400 17px/1.65 Inter;max-width:620px">Quality flooring materials and professional installation for home renovations, ADUs, multifamily communities, hospitality properties, and commercial spaces throughout Los Angeles.</div>
<p class="cap">Inter Regular 17 px / 1.65 · body text · SIL Open Font License</p></div>
<div class="type"><div style="font:600 15px Inter;color:#172B3A">Request an Estimate</div>
<p class="cap">Inter SemiBold 15 px · buttons, labels, navigation</p></div>
<table><tr><th>Style</th><th>Font</th><th>Size (mobile to desktop)</th><th>Line height</th></tr>
<tr><td>Hero headline</td><td>Libre Baskerville Bold</td><td>32–72 px</td><td>1.08</td></tr>
<tr><td>Heading 1</td><td>Libre Baskerville Bold</td><td>34–64 px</td><td>1.18</td></tr>
<tr><td>Heading 2</td><td>Libre Baskerville Bold</td><td>28–42 px</td><td>1.18</td></tr>
<tr><td>Heading 3</td><td>Libre Baskerville Bold</td><td>20–24 px</td><td>1.3</td></tr>
<tr><td>Body</td><td>Inter Regular</td><td>17 px</td><td>1.65</td></tr>
<tr><td>Small / labels</td><td>Inter Medium–SemiBold</td><td>13–15 px</td><td>1.4–1.6</td></tr></table>
<p>Use sentence case for most headings and limit uppercase to the logo. Keep paragraphs short and lines under about 70 characters.</p>

<h2>Imagery</h2>
<p>Warm, natural architectural photography where the floor is clearly visible. Use V &amp; A Flooring’s own project and crew photography whenever it exists. Any non-company image must be labelled as illustrative and never presented as completed V &amp; A Flooring work.</p>

<h2>Files</h2>
<p>All logo artwork is flat vector SVG in <code>public/brand/</code>. Favicons are in <code>src/app/</code>. The geometry is generated by <code>design-source/logo/build_logo.py</code>, so proportions can be adjusted and every file rebuilt consistently.</p>
</main></body></html>"""

(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs/brand-reference.html").write_text(html)
print("wrote docs/brand-reference.html", len(html) // 1024, "KB")
