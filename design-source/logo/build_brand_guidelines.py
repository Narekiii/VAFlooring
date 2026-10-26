"""Builds docs/va-flooring-brand-guidelines.html (and a PDF next to it).
Run from the repository root:  python3 design-source/logo/build_brand_guidelines.py
"""
import base64, pathlib, re
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
B = ROOT / "public/brand"
_n = [0]


def svg(name, cls=""):
    _n[0] += 1
    t = (B / name).read_text()
    t = t.replace('id="t"', f'id="t{_n[0]}"').replace('aria-labelledby="t"', f'aria-labelledby="t{_n[0]}"')
    return t.replace("<svg ", f'<svg class="{cls}" ', 1) if cls else t


fav = (ROOT / "src/app/icon.svg").read_text()
serif = base64.b64encode((ROOT / "src/app/fonts/LibreBaskerville-Variable.woff2").read_bytes()).decode()
sans = base64.b64encode((ROOT / "src/app/fonts/Inter-Variable.woff2").read_bytes()).decode()
mont = base64.b64encode((pathlib.Path(__file__).parent / "Montserrat-VF.ttf").read_bytes()).decode()


def rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def cmyk(h):
    r, g, b = (x / 255 for x in rgb(h))
    k = 1 - max(r, g, b)
    if k >= 1:
        return (0, 0, 0, 100)
    c, m, y = ((1 - x - k) / (1 - k) for x in (r, g, b))
    return tuple(round(v * 100) for v in (c, m, y, k))


def lum(h):
    c = [x / 255 for x in rgb(h)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def cr(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


primary = [
    ("Foundation Navy", "#172B3A", "Primary brand color. Logo, headlines, navigation, footer, dark sections.", "#F7F4EE", "30%"),
    ("Warm Ivory", "#F7F4EE", "Main page background. Light logo color on navy.", "#172B3A", "40%"),
    ("White", "#FFFFFF", "Alternate background, cards, form fields.", "#172B3A", "15%"),
    ("Natural Sand", "#E6DED1", "Alternate sections and quiet surfaces.", "#172B3A", "8%"),
    ("Graphite", "#303538", "Body text.", "#FFFFFF", "text"),
    ("Deep Bronze", "#75552F", "Primary buttons (white text) and small accent text on light backgrounds.", "#FFFFFF", "4%"),
    ("Muted Brass", "#AA8453", "Signature accent: the logo’s center plank and short rules. Never body text on light backgrounds.", "#172B3A", "3%"),
]
derived = [
    ("Bronze Pressed", "#5E4424", "Primary button hover / pressed."),
    ("Ink Soft", "#4A5A66", "Secondary text, captions, labels on light backgrounds."),
    ("Brass Light", "#C7A57A", "Small accent text and labels on navy."),
    ("Navy Raised", "#213848", "Hover surface on navy."),
    ("Line", "#D9CFBF", "Hairline dividers on ivory and white."),
    ("Line Dark", "#3A4F5F", "Hairline dividers on navy."),
    ("Field Border", "#6B7278", "Form field outlines."),
    ("Error", "#9C2F23", "Form errors only."),
    ("Success", "#2F5D3A", "Confirmation messages only."),
]
pairs = [
    ("#172B3A", "#F7F4EE", "Headlines and logo on ivory"),
    ("#303538", "#F7F4EE", "Body text on ivory"),
    ("#172B3A", "#E6DED1", "Text on sand"),
    ("#F7F4EE", "#172B3A", "Text on navy"),
    ("#C7A57A", "#172B3A", "Accent labels on navy"),
    ("#FFFFFF", "#75552F", "Primary button"),
    ("#75552F", "#F7F4EE", "Accent text on ivory"),
    ("#4A5A66", "#FFFFFF", "Secondary text on white"),
    ("#AA8453", "#F7F4EE", "Brass on ivory"),
    ("#AA8453", "#172B3A", "Brass on navy"),
]


def swatch(name, hx, role, fg, share):
    r, g, b = rgb(hx)
    c, m, y, k = cmyk(hx)
    border = "border:1px solid #D9CFBF;" if hx in ("#FFFFFF", "#F7F4EE") else ""
    return f"""<div class="sw"><div class="chip" style="background:{hx};color:{fg};{border}"><span>{name}</span><b>{hx}</b></div>
<dl><div><dt>HEX</dt><dd>{hx}</dd></div><div><dt>RGB</dt><dd>{r} {g} {b}</dd></div><div><dt>CMYK*</dt><dd>{c} {m} {y} {k}</dd></div><div><dt>Share</dt><dd>{share}</dd></div></dl>
<p>{role}</p></div>"""


def mini(name, hx, role):
    fg = "#FFFFFF" if lum(hx) < 0.3 else "#172B3A"
    border = "border:1px solid rgba(0,0,0,.08);"
    return f'<div class="mini"><div class="mchip" style="background:{hx};color:{fg};{border}">{hx}</div><div><strong>{name}</strong><span>{role}</span></div></div>'


def pair(fg, bg, use):
    ratio = cr(fg, bg)
    if ratio >= 7:
        v = "AAA, all text"
    elif ratio >= 4.5:
        v = "AA, all text"
    elif ratio >= 3:
        v = "Large text and graphics only"
    else:
        v = "Decorative only"
    return f'<tr><td><span class="pp" style="background:{bg};color:{fg}">Aa</span></td><td>{use}</td><td>{ratio:.1f}:1</td><td>{v}</td></tr>'


css = f"""
@font-face {{ font-family: "Libre Baskerville"; src: url(data:font/woff2;base64,{serif}) format("woff2"); font-weight: 400 700; }}
@font-face {{ font-family: "Montserrat"; src: url(data:font/ttf;base64,{mont}) format("truetype"); font-weight: 100 900; }}
@font-face {{ font-family: "Inter"; src: url(data:font/woff2;base64,{sans}) format("woff2"); font-weight: 100 900; }}
:root {{ --navy:#172B3A; --ivory:#F7F4EE; --sand:#E6DED1; --brass:#AA8453; --bronze:#75552F; --graphite:#303538; --soft:#4A5A66; --line:#D9CFBF; --brassl:#C7A57A; }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin: 0; background: var(--ivory); color: var(--graphite); font: 16px/1.6 Inter, Arial, sans-serif; }}
main {{ max-width: 1120px; margin: 0 auto; padding: 0 28px 96px; }}
h1, h2, h3 {{ color: var(--navy); font-family: Inter, sans-serif; font-weight: 800; letter-spacing: -0.028em; margin: 0; line-height: 1.08; }}
h2 {{ font-size: 38px; margin-bottom: 14px; }}
h3 {{ font-size: 20px; font-weight: 750; letter-spacing: -0.015em; margin: 36px 0 12px; line-height: 1.25; }}
p {{ max-width: 700px; margin: 8px 0 0; }}
.kicker {{ display: flex; align-items: center; gap: 12px; margin: 0 0 14px; color: var(--bronze); font-size: 13px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }}
.kicker::before {{ content: ""; width: 32px; height: 3px; background: var(--brass); }}
section.part {{ padding-top: 72px; margin-top: 72px; border-top: 3px solid var(--navy); break-before: page; }}
.lede {{ font-size: 19px; color: var(--soft); max-width: 760px; }}
.cover {{ background: var(--navy); color: var(--ivory); padding: 72px 28px 64px; }}
.cover .in {{ max-width: 1064px; margin: 0 auto; }}
.cover svg.logo {{ width: 420px; max-width: 100%; height: auto; display: block; }}
.cover h1 {{ color: var(--ivory); font-size: 64px; margin-top: 72px; }}
.cover p {{ color: var(--sand); font-size: 19px; }}
.cover .meta {{ margin-top: 48px; color: var(--brassl); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; font-weight: 800; }}
.toc {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 48px; }}
.toc a {{ display: block; padding: 14px 16px; background: #213848; color: var(--ivory); text-decoration: none; font-weight: 700; font-size: 14px; }}
.toc a span {{ display: block; color: var(--brassl); font-size: 12px; font-weight: 800; letter-spacing: .1em; }}
.grid {{ display: grid; gap: 16px; }} .g2 {{ grid-template-columns: repeat(2, minmax(0,1fr)); }} .g3 {{ grid-template-columns: repeat(3, minmax(0,1fr)); }} .g4 {{ grid-template-columns: repeat(4, minmax(0,1fr)); }}
.card {{ background: #fff; border: 1px solid var(--line); padding: 22px; }}
.card h4 {{ margin: 0 0 6px; color: var(--navy); font-size: 16px; font-weight: 800; }}
.card p {{ margin: 0; font-size: 14.5px; }}
.tile {{ display: flex; align-items: center; justify-content: center; min-height: 200px; padding: 36px; }}
.tile svg {{ max-width: 100%; height: auto; }}
.light {{ background: var(--ivory); border: 1px solid var(--line); }} .white {{ background: #fff; border: 1px solid var(--line); }}
.cap {{ font-size: 13px; color: var(--soft); margin-top: 8px; }}
code {{ font: 12px/1.4 ui-monospace, Menlo, monospace; background: #fff; padding: 1px 5px; border: 1px solid var(--line); }}
.hl {{ width: 380px; }} .st {{ width: 190px; }} .mo {{ width: 110px; }}
.sw {{ background: #fff; border: 1px solid var(--line); }}
.chip {{ height: 132px; display: flex; flex-direction: column; justify-content: space-between; padding: 14px 16px; }}
.chip span {{ font-weight: 800; font-size: 17px; letter-spacing: -.01em; }} .chip b {{ font-size: 13px; font-weight: 700; letter-spacing: .04em; }}
.sw dl {{ display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; margin: 0; padding: 14px 16px 0; font-size: 13px; }}
.sw dt {{ color: var(--soft); font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }} .sw dd {{ margin: 0; color: var(--navy); font-weight: 600; }}
.sw p {{ padding: 10px 16px 16px; margin: 0; font-size: 13.5px; color: var(--graphite); }}
.ratio {{ display: flex; height: 64px; margin-top: 18px; border: 1px solid var(--line); }}
.ratio div {{ display: flex; align-items: flex-end; padding: 8px; font-size: 11px; font-weight: 800; letter-spacing: .06em; }}
.mini {{ display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 14px; }}
.mini strong {{ display: block; color: var(--navy); }} .mini span {{ color: var(--soft); }}
.mchip {{ height: 44px; display: flex; align-items: flex-end; padding: 5px 8px; font-size: 11px; font-weight: 700; }}
table {{ border-collapse: collapse; width: 100%; font-size: 14px; margin-top: 12px; background: #fff; }}
td, th {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--line); vertical-align: middle; }}
th {{ color: var(--soft); font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; background: var(--ivory); }}
.pp {{ display: inline-flex; width: 46px; height: 32px; align-items: center; justify-content: center; font-weight: 800; border: 1px solid rgba(0,0,0,.08); }}
.spec {{ padding: 26px 0; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: center; }}
.spec .cap {{ margin: 0; }}
.do li::marker {{ content: "✓  "; color: #2f5d3a; font-weight: 800; }} .dont li::marker {{ content: "✕  "; color: #9c2f23; font-weight: 800; }}
ul {{ padding-left: 22px; }} li {{ margin: 5px 0; }}
.misuse {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }}
.misuse figure {{ margin: 0; background: #fff; border: 1px solid var(--line); }}
.misuse .box {{ height: 120px; display: flex; align-items: center; justify-content: center; padding: 16px; overflow: hidden; position: relative; }}
.misuse .box svg {{ width: 180px; height: auto; }} .misuse .box div[style*='width:48px'] svg {{ width: 48px; }}
.misuse figcaption {{ padding: 10px 12px; font-size: 13px; border-top: 1px solid var(--line); }}
.misuse figcaption::before {{ content: "✕ "; color: #9c2f23; font-weight: 800; }}
.clear {{ position: relative; display: inline-block; padding: 34px; background: repeating-linear-gradient(45deg, rgba(170,132,83,.16) 0 6px, transparent 6px 12px); outline: 1px dashed var(--brass); }}
.clear svg {{ width: 360px; display: block; background: var(--ivory); }}
.sizes {{ display: flex; gap: 34px; align-items: end; flex-wrap: wrap; margin-top: 12px; }}
.sizes div {{ text-align: center; font-size: 12px; color: var(--soft); }} .sizes svg {{ display: block; margin: 0 auto 6px; }}
.btn {{ display: inline-flex; align-items: center; min-height: 52px; padding: 0 26px; font-weight: 750; font-size: 15px; border: 2px solid transparent; border-radius: 2px; }}
.bizcard {{ width: 350px; height: 200px; box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 8px 24px rgba(23,43,58,.12); position: relative; overflow: hidden; }}
.bizcard.front {{ background: var(--navy); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 14px; }}
.bizcard.front svg {{ width: 230px; height: auto; }}
.bizcard.front p {{ margin: 0; color: var(--brassl); font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }}
.bizcard.back {{ background: #fff; padding: 22px 24px; }}
.bizcard.back::before {{ content: ""; position: absolute; left: 24px; top: 22px; width: 28px; height: 3px; background: var(--brass); }}
.bizcard.back .nm {{ margin-top: 14px; color: var(--navy); font-weight: 800; font-size: 17px; letter-spacing: -.01em; }}
.bizcard.back .ti {{ color: var(--bronze); font-size: 11px; font-weight: 700; }}
.bizcard.back .ct {{ margin-top: 14px; font-size: 11px; line-height: 1.55; color: var(--graphite); }}
.bizcard.back .lic {{ position: absolute; left: 24px; bottom: 14px; font-size: 8.5px; color: var(--soft); letter-spacing: .02em; }}
.bizcard.back svg {{ position: absolute; right: 22px; top: 20px; width: 42px; height: auto; }}
.sig {{ background: #fff; border: 1px solid var(--line); padding: 22px; font: 13px/1.5 Arial, sans-serif; color: #303538; }}
.sig table {{ width: auto; background: none; margin: 0; }} .sig td {{ border: 0; padding: 0 14px 0 0; vertical-align: top; }}
.avatar {{ width: 120px; height: 120px; border-radius: 50%; overflow: hidden; }}
.avatar svg {{ width: 100%; height: 100%; display: block; }}
.facts {{ display: grid; grid-template-columns: 220px 1fr; background: #fff; border: 1px solid var(--line); }}
.facts div {{ padding: 11px 16px; border-bottom: 1px solid var(--line); font-size: 14.5px; }}
.facts div:nth-child(odd) {{ color: var(--soft); font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; background: var(--ivory); }}
.quote {{ border-left: 4px solid var(--brass); padding: 4px 0 4px 18px; margin: 18px 0; font-size: 22px; font-weight: 800; color: var(--navy); letter-spacing: -.02em; }}
.foot {{ margin-top: 80px; padding-top: 18px; border-top: 1px solid var(--line); font-size: 12px; color: var(--soft); }}
@media screen and (max-width: 760px) {{ .g2,.g3,.g4,.toc,.misuse {{ grid-template-columns: 1fr; }} .spec {{ grid-template-columns: 1fr; }} .cover h1 {{ font-size: 40px; }} h2 {{ font-size: 30px; }} .facts {{ grid-template-columns: 1fr; }} }}
@media print {{ @page {{ size: letter; margin: 0.45in; }} body {{ background: #F7F4EE; }} main {{ padding: 0; }} .cover {{ padding: 48px 32px; }} section.part {{ padding-top: 0; margin-top: 0; border-top: 0; }} .card, .sw, .misuse figure, table, .bizcard, .tile {{ break-inside: avoid; }} }}
"""

H = svg  # alias

body = f"""
<header class="cover">
  <div class="in">
    {svg("va-flooring-horizontal-reverse.svg", "logo")}
    <h1>Brand Identity<br>Guidelines</h1>
    <p>Logo, color, typography, voice and everyday applications for V&nbsp;&amp;&nbsp;A Flooring.</p>
    <p class="meta">Version 3.0 · October 2026 · Family Owned • Since 1999</p>
    <nav class="toc" aria-label="Contents">
      <a href="#brand"><span>01</span>Brand foundation</a>
      <a href="#logo"><span>02</span>Logo</a>
      <a href="#color"><span>03</span>Color</a>
      <a href="#type"><span>04</span>Typography</a>
      <a href="#ui"><span>05</span>Graphic elements</a>
      <a href="#imagery"><span>06</span>Imagery</a>
      <a href="#voice"><span>07</span>Voice &amp; messaging</a>
      <a href="#apps"><span>08</span>Applications &amp; files</a>
    </nav>
  </div>
</header>
<main>

<section class="part" id="brand">
<p class="kicker">01 · Brand foundation</p>
<h2>Who we are</h2>
<p class="lede">V&nbsp;&amp;&nbsp;A Flooring is a family-owned flooring contractor in Sun Valley, California, founded in 1999 by installer Armond Markarian. We supply flooring materials and install them for homeowners, builders, property managers, hotels and commercial clients across Los Angeles, Orange and Ventura counties.</p>
<div class="quote">Personal accountability backed by substantial installation capacity.</div>
<div class="grid g3">
  <div class="card"><h4>Positioning</h4><p>The customer care of a family-owned company with the experience and crew capacity (20+ installation crews) needed for major flooring projects.</p></div>
  <div class="card"><h4>Promise</h4><p>Good materials, careful installation, honest guidance and support that continues after the job is complete.</p></div>
  <div class="card"><h4>Tagline</h4><p><strong>Flooring Expertise. Family Accountability. Since 1999.</strong><br>Supporting line: Family Owned • Since 1999</p></div>
</div>
<h3>Values</h3>
<div class="grid g4">
  <div class="card"><h4>Honesty</h4><p>Straight answers about materials, pricing and timing.</p></div>
  <div class="card"><h4>Hard Work</h4><p>Started by an installer; judged by the floors our crews leave behind.</p></div>
  <div class="card"><h4>Initiative</h4><p>We see a problem and act on it, on every job.</p></div>
  <div class="card"><h4>Trust</h4><p>Showing up when we said we would and following through.</p></div>
</div>
<h3>Audiences</h3>
<div class="grid g2">
  <div class="card"><h4>Residential</h4><p>Homeowners renovating occupied homes, building ADUs or updating single rooms. They want guidance, respect for their home and a clear schedule.</p></div>
  <div class="card"><h4>Commercial &amp; multifamily</h4><p>General contractors, developers, property managers, hospitality operators and multifamily owners. They want capacity, coordination, clear scope and one accountable supplier-installer.</p></div>
</div>
<h3>Personality</h3>
<p>Established, architectural, approachable. Confident without boasting; warm without being casual; organized and dependable. The look is <strong>bold and corporate</strong>: heavy navy type, clean structure and restrained brass details.</p>
</section>

<section class="part" id="logo">
<p class="kicker">02 · Logo</p>
<h2>The V&nbsp;&amp;&nbsp;A Flooring Inc logo</h2>
<p class="lede">The mark is a parquet pattern: four navy planks locked around a single brass plank, the way flooring is laid. All four gaps are equal, and the brass center plank is the one warm accent. The wordmark reads “V&nbsp;&amp;&nbsp;A FLOORING INC,” with “V&nbsp;&amp;&nbsp;A” in Montserrat Black and “FLOORING INC” in Montserrat SemiBold, in uppercase.</p>

<h3>Primary logo: horizontal</h3>
<div class="grid g2">
  <div><div class="tile light">{svg("va-flooring-horizontal-navy.svg", "hl")}</div><p class="cap">Full color for light backgrounds · <code>va-flooring-horizontal-navy.svg</code></p></div>
  <div><div class="tile" style="background:#172B3A">{svg("va-flooring-horizontal-reverse.svg", "hl")}</div><p class="cap">Reverse for navy and dark backgrounds · <code>va-flooring-horizontal-reverse.svg</code></p></div>
</div>
<p>Use the horizontal logo by default: website header, letterhead, invoices, email signatures, vehicle doors, jobsite signs.</p>

<h3>Stacked logo</h3>
<div class="grid g3">
  <div><div class="tile light">{svg("va-flooring-stacked-navy.svg", "st")}</div><p class="cap"><code>va-flooring-stacked-navy.svg</code></p></div>
  <div><div class="tile" style="background:#172B3A">{svg("va-flooring-stacked-reverse.svg", "st")}</div><p class="cap"><code>va-flooring-stacked-reverse.svg</code></p></div>
  <div><div class="tile" style="background:#E6DED1">{svg("va-flooring-stacked-mono-navy.svg", "st")}</div><p class="cap">One color · <code>va-flooring-stacked-mono-navy.svg</code></p></div>
</div>
<p>Use where space is square or tall: footer, business card front, polo shirts, hard hats, social posts, trade-show banners.</p>

<h3>Mark (parquet symbol)</h3>
<div class="grid g4">
  <div><div class="tile white">{svg("va-flooring-monogram-navy.svg", "mo")}</div><p class="cap">Full color</p></div>
  <div><div class="tile" style="background:#172B3A">{svg("va-flooring-monogram-reverse.svg", "mo")}</div><p class="cap">Reverse</p></div>
  <div><div class="tile" style="background:#75552F">{svg("va-flooring-monogram-mono-white.svg", "mo")}</div><p class="cap">White, one color</p></div>
  <div><div class="tile white">{svg("va-flooring-monogram-mono-black.svg", "mo")}</div><p class="cap">Black, one color (center plank knocked out)</p></div>
</div>
<p>For small or secondary spaces once the full name is already visible: favicon, social avatar, app icon, embroidery on sleeves, stamps, tape and packaging.</p>

<h3>One-color versions</h3>
<div class="grid g3">
  <div><div class="tile white">{svg("va-flooring-horizontal-mono-navy.svg", "hl")}</div><p class="cap">Navy · <code>…-mono-navy.svg</code></p></div>
  <div><div class="tile white">{svg("va-flooring-horizontal-mono-black.svg", "hl")}</div><p class="cap">Black · <code>…-mono-black.svg</code></p></div>
  <div><div class="tile" style="background:#303538">{svg("va-flooring-horizontal-mono-white.svg", "hl")}</div><p class="cap">White · <code>…-mono-white.svg</code></p></div>
</div>
<p>For one-color print, embroidery, vinyl cutting, engraving, rubber stamps and photocopies. In one color the brass center plank is knocked out (left empty) so the pattern still reads.</p>

<h3>Clear space</h3>
<div class="clear">{svg("va-flooring-horizontal-navy.svg")}</div>
<p>Keep a margin around the logo at least equal to the <strong>height of the brass center plank</strong> (about one third of the mark’s height). Keep text, photos, other logos and edges out of this area.</p>

<h3>Minimum size</h3>
<div class="sizes">
  <div><div style="width:180px">{svg("va-flooring-horizontal-mono-navy.svg")}</div>Horizontal: 180 px / 1.5 in wide</div>
  <div><div style="width:90px">{svg("va-flooring-stacked-mono-navy.svg")}</div>Stacked: 90 px / 0.75 in wide</div>
  <div><div style="width:24px">{svg("va-flooring-monogram-navy.svg")}</div>Mark: 16 px / 0.2 in</div>
  <div><div style="width:32px">{fav}</div>Favicon 32 px</div>
  <div><div style="width:16px">{fav}</div>16 px</div>
</div>
<p>Below these sizes use the mark on its own. At favicon size the mark sits on a navy tile.</p>

<h3>Backgrounds</h3>
<div class="grid g4">
  <div><div class="tile" style="background:#F7F4EE;min-height:120px">{svg("va-flooring-horizontal-navy.svg")}</div><p class="cap">✓ Ivory</p></div>
  <div><div class="tile" style="background:#FFFFFF;border:1px solid #D9CFBF;min-height:120px">{svg("va-flooring-horizontal-navy.svg")}</div><p class="cap">✓ White</p></div>
  <div><div class="tile" style="background:#E6DED1;min-height:120px">{svg("va-flooring-horizontal-navy.svg")}</div><p class="cap">✓ Sand</p></div>
  <div><div class="tile" style="background:#172B3A;min-height:120px">{svg("va-flooring-horizontal-reverse.svg")}</div><p class="cap">✓ Navy</p></div>
</div>
<p>On photographs, place the reverse logo only over calm, dark areas, or put it on a solid navy panel.</p>

<h3>Do not</h3>
<div class="misuse">
  <figure><div class="box white"><div style="transform:scaleX(1.45)">{svg("va-flooring-horizontal-navy.svg")}</div></div><figcaption>Stretch or squash</figcaption></figure>
  <figure><div class="box white" style="filter:hue-rotate(160deg) saturate(3)">{svg("va-flooring-horizontal-navy.svg")}</div><figcaption>Change the colors</figcaption></figure>
  <figure><div class="box white"><div style="transform:rotate(-12deg)">{svg("va-flooring-horizontal-navy.svg")}</div></div><figcaption>Rotate or tilt</figcaption></figure>
  <figure><div class="box" style="background:#AA8453">{svg("va-flooring-horizontal-navy.svg")}</div><figcaption>Place on brass or busy colors</figcaption></figure>
  <figure><div class="box white" style="font:700 20px 'Times New Roman';color:#172B3A">V&amp;A Flooring Inc.</div><figcaption>Retype the wordmark</figcaption></figure>
  <figure><div class="box white"><div style="filter:drop-shadow(3px 4px 2px rgba(0,0,0,.55))">{svg("va-flooring-horizontal-navy.svg")}</div></div><figcaption>Add shadows, glows or bevels</figcaption></figure>
  <figure><div class="box" style="background:#303538">{svg("va-flooring-horizontal-navy.svg")}</div><figcaption>Use navy logo on dark backgrounds</figcaption></figure>
  <figure><div class="box white" style="gap:8px"><div style="width:48px">{svg("va-flooring-monogram-navy.svg")}</div><span style="font:800 13px Inter;color:#172B3A;border:1px solid #ccc;padding:4px 6px">PARTNER</span></div><figcaption>Lock up with Lowe’s or manufacturer logos</figcaption></figure>
</div>
<p>Also avoid: rearranging or recoloring individual planks, adding more planks, outlining the logo, adding a roof, hammer or other clip-art, or placing the logo inside a box with rounded corners.</p>
</section>

<section class="part" id="color">
<p class="kicker">03 · Color</p>
<h2>Color palette</h2>
<p class="lede">Warm ivory and white carry the pages. Foundation Navy is the brand’s anchor. Sand separates sections. Brass is a small signature accent, and Deep Bronze is reserved for primary action buttons.</p>
<div class="grid g4" style="margin-top:22px">{''.join(swatch(*c) for c in primary[:4])}</div>
<div class="grid g3" style="margin-top:16px">{''.join(swatch(*c) for c in primary[4:])}</div>
<p class="cap">* CMYK values are calculated conversions for reference. For printed work, ask the printer to match the HEX values and approve a printed proof; check navy and brass especially on uncoated stock.</p>

<h3>Proportion</h3>
<div class="ratio">
  <div style="flex:40;background:#F7F4EE;color:#172B3A">IVORY 40</div>
  <div style="flex:30;background:#172B3A;color:#F7F4EE">NAVY 30</div>
  <div style="flex:15;background:#FFFFFF;color:#172B3A;border-left:1px solid #D9CFBF">WHITE 15</div>
  <div style="flex:8;background:#E6DED1;color:#172B3A">SAND 8</div>
  <div style="flex:4;background:#75552F;color:#fff">4</div>
  <div style="flex:3;background:#AA8453;color:#172B3A">3</div>
</div>
<p>Roughly how much of a typical page or printed piece each color should cover. Graphite is used for body text.</p>

<h3>Supporting interface tones</h3>
<p>Tints and shades of the core palette, used on the website where contrast or states require them.</p>
<div class="grid g3" style="gap:0 28px;margin-top:8px">{''.join(mini(*d) for d in derived)}</div>

<h3>Accessible color combinations (WCAG 2.2)</h3>
<table><tr><th></th><th>Use</th><th>Contrast</th><th>Result</th></tr>{''.join(pair(*p) for p in pairs)}</table>
<p><strong>Rule:</strong> never set body text or small text in Muted Brass on light backgrounds. On light backgrounds, use Deep Bronze for accent text instead.</p>

<h3>Avoid</h3>
<ul class="dont"><li>Bright orange or safety-yellow “construction” colors.</li><li>Black and gold “luxury” combinations, metallic or glossy gold effects.</li><li>Gradients, glass effects or wood-grain textures as backgrounds.</li><li>Brass used as a large background color.</li></ul>
</section>

<section class="part" id="type">
<p class="kicker">04 · Typography</p>
<h2>Typefaces</h2>
<div class="grid g2">
  <div class="card"><p class="kicker" style="margin:0 0 10px">Primary · all communication</p><div style="font:800 56px/1 Inter;color:#172B3A;letter-spacing:-.03em">Inter</div><p style="font:400 15px Inter">Aa Bb Cc Dd Ee Ff Gg 0123456789</p><p class="cap">Headlines (ExtraBold 800), body (Regular 400), buttons and labels (SemiBold–Bold 600–750). Free, SIL Open Font License · fonts.google.com/specimen/Inter</p></div>
  <div class="card"><p class="kicker" style="margin:0 0 10px">Logo wordmark only</p><div style="font:900 50px/1 Montserrat;color:#172B3A">MONTSERRAT</div><p style="font:600 15px Montserrat">Aa Bb Cc Dd Ee Ff Gg 0123456789</p><p class="cap">Montserrat Black and SemiBold are built into the wordmark as outlines, so the logo never depends on the font being installed. Use it only for the logo or short uppercase signage text matching the logo. Free, SIL Open Font License.</p></div>
</div>
<p>If Inter is not installed (for example in Word or PowerPoint), use <strong>Arial</strong> as the fallback. Bold Arial for headlines, regular Arial for text.</p>

<h3>Type scale</h3>
<div class="spec"><div style="font:800 64px/1.05 Inter;letter-spacing:-.032em;color:#172B3A">Hardwood Flooring Installation</div><p class="cap">Display / Hero<br>Inter ExtraBold 800 · 40–72 px · line 1.05 · tracking −3%</p></div>
<div class="spec"><div style="font:800 44px/1.08 Inter;letter-spacing:-.028em;color:#172B3A">Flooring services in Los Angeles</div><p class="cap">Heading 1–2<br>Inter ExtraBold 800 · 30–48 px · line 1.08 · tracking −2.8%</p></div>
<div class="spec"><div style="font:750 23px/1.25 Inter;letter-spacing:-.015em;color:#172B3A">Honest Guidance</div><p class="cap">Heading 3<br>Inter Bold 750 · 19–23 px · line 1.25</p></div>
<div class="spec"><div style="display:flex;align-items:center;gap:12px;color:#75552F;font:800 13px Inter;letter-spacing:.14em;text-transform:uppercase"><span style="width:32px;height:3px;background:#AA8453;display:inline-block"></span>Flooring services</div><p class="cap">Kicker label<br>Inter ExtraBold 800 · 13 px · uppercase · tracking +14% · brass rule. Once per section.</p></div>
<div class="spec"><div style="font:400 17px/1.65 Inter;color:#303538;max-width:560px">We supply the flooring we install, so material advice comes from people who also plan the installation. We’ll help you narrow the options by what the floor needs to do.</div><p class="cap">Body<br>Inter Regular 400 · 17 px · line 1.65 · Graphite · max ~70 characters per line</p></div>
<div class="spec"><div><span class="btn" style="background:#75552F;color:#fff">Request an Estimate</span></div><p class="cap">Button label<br>Inter Bold 750 · 15 px · sentence/title case</p></div>
<h3>Rules</h3>
<ul class="do"><li>Use sentence case or title case for headlines; reserve uppercase for short kicker labels.</li><li>Keep paragraphs short; left-align text.</li><li>Use Navy for headlines, Graphite for body text.</li></ul>
<ul class="dont"><li>Don’t use more than two weights in one line, italics for emphasis in headlines, or outlined/shadowed text.</li><li>Don’t center long paragraphs.</li></ul>
</section>

<section class="part" id="ui">
<p class="kicker">05 · Graphic elements</p>
<h2>Graphic elements</h2>
<div class="grid g3">
  <div class="card"><h4>The brass plank</h4><div style="width:32px;height:3px;background:#AA8453;margin:12px 0"></div><p>A short 32 × 3 px brass rule echoing the logo’s brass center plank. Used above kicker labels, on top of feature items and on printed pieces. One per element.</p></div>
  <div class="card"><h4>Corners</h4><div style="width:60px;height:36px;border:2px solid #172B3A;border-radius:2px;margin:12px 0"></div><p>Near-square corners (2 px radius) on buttons, cards, images and form fields. No pill shapes or large rounded cards.</p></div>
  <div class="card"><h4>Lines</h4><div style="height:1px;background:#D9CFBF;margin:28px 0 8px"></div><div style="height:3px;background:#172B3A;margin:0 0 12px"></div><p>1 px Line hairlines between items; a 3 px navy rule to open major sections.</p></div>
</div>
<h3>Buttons</h3>
<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;padding:24px;background:#fff;border:1px solid #D9CFBF">
  <span class="btn" style="background:#75552F;color:#fff">Request an Estimate</span>
  <span class="btn" style="border-color:#172B3A;color:#172B3A">Explore Our Projects</span>
  <span style="padding:24px;background:#172B3A;display:inline-flex;gap:14px"><span class="btn" style="background:#F7F4EE;color:#172B3A">Request an Estimate</span><span class="btn" style="border-color:#F7F4EE;color:#F7F4EE">Explore</span></span>
</div>
<p>Primary (Deep Bronze, white text) for the main action, used once per screen area. Secondary (navy outline) for other actions. On navy, use the ivory and ivory-outline versions.</p>
<h3>Layout</h3>
<p>Content width 1216 px with 20–48 px side margins; generous vertical spacing between sections (64–120 px); a 4 px spacing base. Alternate ivory, white, sand and navy sections to separate content instead of boxes and shadows.</p>
</section>

<section class="part" id="imagery">
<p class="kicker">06 · Imagery</p>
<h2>Photography</h2>
<div class="grid g2">
  <div class="card"><h4>Use</h4><ul class="do"><li>Real V&nbsp;&amp;&nbsp;A projects and crews whenever available.</li><li>Warm, natural daylight; architectural angles where the floor is clearly visible.</li><li>Realistic homes, ADUs, apartment common areas, hotel corridors, offices.</li><li>Close-ups of plank seams, transitions and workmanship.</li></ul></div>
  <div class="card"><h4>Avoid</h4><ul class="dont"><li>Generic stock with posed people or over-styled luxury interiors.</li><li>Busy images behind small text.</li><li>Heavy filters, strong color casts, HDR effects.</li><li>Presenting stock or renderings as completed V&nbsp;&amp;&nbsp;A work. Label illustrations as “Illustrative rendering.”</li></ul></div>
</div>
<p>Shooting tips for project photos: shoot after cleanup in daylight, at hip height with a wide lens, include one wide shot and two details per room, keep verticals straight, and record the location, property type, material and scope for each project.</p>
</section>

<section class="part" id="voice">
<p class="kicker">07 · Voice &amp; messaging</p>
<h2>How we sound</h2>
<div class="grid g4">
  <div class="card"><h4>Clear</h4><p>Plain words over jargon; say what happens next.</p></div>
  <div class="card"><h4>Honest</h4><p>No exaggeration; state trade-offs.</p></div>
  <div class="card"><h4>Respectful</h4><p>Of the customer’s home, time and budget.</p></div>
  <div class="card"><h4>Capable</h4><p>Calm confidence for large projects.</p></div>
</div>
<h3>Key messages</h3>
<ul><li>Family owned since 1999.</li><li>Flooring materials and installation from one company.</li><li>More than 20 installation crews for residential, multifamily, hospitality and commercial projects.</li><li>Hardwood, laminate, luxury vinyl plank, carpet and tile.</li><li>Honest guidance, respect for your schedule, competitive pricing, support after installation.</li><li>Serving Los Angeles, Orange and Ventura counties.</li></ul>
<h3>Approved wording</h3>
<table>
<tr><th>Topic</th><th>Use exactly</th></tr>
<tr><td>Lowe’s</td><td>“Serving Lowe’s installation customers for more than 20 years.” Text only, smaller than the V&nbsp;&amp;&nbsp;A brand, no Lowe’s logo.</td></tr>
<tr><td>Manufacturers</td><td>“Products from manufacturers including Mohawk, Shaw and Engineered Floors.” Text only unless logos are approved.</td></tr>
<tr><td>American made</td><td>“American-made options from established flooring manufacturers.” Never “all American made.”</td></tr>
<tr><td>License</td><td>“CSLB License #866991 (B, C-15, C-54) · Bonded &amp; Insured.” Required on ads, vehicles, proposals and contracts in California.</td></tr>
</table>
<h3>Words to avoid</h3>
<p>“LA’s largest,” “number one,” “best prices,” “guaranteed perfect installation,” “lifetime warranty,” “waterproof” or “scratchproof” (unless quoting a specific manufacturer’s product specification), and invented reviews or testimonials.</p>
<h3>Business details (use consistently everywhere)</h3>
<div class="facts">
  <div>Name</div><div>V&nbsp;&amp;&nbsp;A Flooring Inc (logo and legal name). “V&nbsp;&amp;&nbsp;A Flooring” is fine in running text. Never “VA Flooring” or “V&amp;A” without spaces.</div>
  <div>Address</div><div>10945 Pendleton St, Sun Valley, CA 91352</div>
  <div>Phone</div><div>(818) 843-4773</div>
  <div>License</div><div>CSLB #866991 · B, C-15, C-54 · Bonded &amp; Insured</div>
  <div>Founded</div><div>1999 by Armond Markarian · family owned</div>
  <div>Service area</div><div>Los Angeles, Orange and Ventura counties</div>
  <div>Services</div><div>Hardwood, laminate, luxury vinyl plank (LVP), carpet and carpet tile, porcelain and ceramic tile · materials and installation · residential, ADU, multifamily, hospitality, commercial</div>
</div>
</section>

<section class="part" id="apps">
<p class="kicker">08 · Applications &amp; files</p>
<h2>Applications</h2>
<h3>Business card (3.5 × 2 in)</h3>
<div style="display:flex;flex-wrap:wrap;gap:28px">
  <div class="bizcard front">{svg("va-flooring-stacked-reverse.svg")}<p>Family Owned • Since 1999</p></div>
  <div class="bizcard back">{svg("va-flooring-monogram-navy.svg")}<div class="nm">Full Name</div><div class="ti">Title</div><div class="ct">(818) 843-4773<br>10945 Pendleton St, Sun Valley, CA 91352<br>website</div><div class="lic">CSLB #866991 (B, C-15, C-54) · Bonded &amp; Insured</div></div>
</div>
<p class="cap">Example layout; “Full Name,” “Title” and “website” are placeholders to replace.</p>

<h3>Email signature</h3>
<div class="sig"><table><tr><td style="width:56px">{svg("va-flooring-monogram-navy.svg")}</td><td><strong style="color:#172B3A;font-size:14px">Full Name</strong><br><span style="color:#75552F">Title · V&nbsp;&amp;&nbsp;A Flooring</span><br>(818) 843-4773 · 10945 Pendleton St, Sun Valley, CA 91352<br><span style="color:#4A5A66;font-size:11px">CSLB #866991 · Bonded &amp; Insured · Family Owned Since 1999</span></td></tr></table></div>
<p class="cap">Use Arial in email. Monogram at 48 px (export a PNG from the SVG).</p>

<h3>Social avatar, favicon and app icon</h3>
<div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap">
  <div class="avatar">{fav}</div>
  <div style="width:64px">{fav}</div>
  <div style="width:32px">{fav}</div>
</div>
<p>Navy square with the ivory monogram. Use for Google Business Profile, Facebook, Instagram, LinkedIn and Yelp profile images.</p>

<h3>Vehicles, signs and uniforms</h3>
<div class="grid g3">
  <div class="card"><h4>Vehicles</h4><p>Navy or white vehicle. Horizontal logo on doors, phone number large, license line required. No photos or gradients.</p></div>
  <div class="card"><h4>Jobsite signs</h4><p>Navy background, reverse horizontal logo, one line of text (“Flooring by V&nbsp;&amp;&nbsp;A Flooring”), phone and license.</p></div>
  <div class="card"><h4>Uniforms</h4><p>Navy or sand garments; embroider the one-color stacked logo (ivory on navy, navy on sand), monogram on sleeves or caps.</p></div>
</div>

<h3>Logo files</h3>
<table>
<tr><th>File</th><th>Use</th></tr>
<tr><td><code>va-flooring-horizontal-navy.svg</code></td><td>Primary logo on light backgrounds</td></tr>
<tr><td><code>va-flooring-horizontal-reverse.svg</code></td><td>Primary logo on navy / dark backgrounds</td></tr>
<tr><td><code>va-flooring-horizontal-mono-navy / -black / -white.svg</code></td><td>One-color print, embroidery, vinyl, engraving</td></tr>
<tr><td><code>va-flooring-stacked-navy / -reverse / -mono-*.svg</code></td><td>Square and tall spaces</td></tr>
<tr><td><code>va-flooring-monogram-navy / -reverse / -mono-*.svg</code></td><td>The parquet mark alone: avatars, icons, small spaces</td></tr>
<tr><td><code>favicon.ico</code>, <code>icon.svg</code>, <code>icon-192.png</code>, <code>icon-512.png</code></td><td>Website and app icons</td></tr>
</table>
<p>All logos are flat vector SVG and scale to any size. For print shops that need PDF or EPS, open the SVG in Illustrator, Affinity Designer or Inkscape and save as PDF/EPS. Do not redraw the logo.</p>
<p class="foot">V&nbsp;&amp;&nbsp;A Flooring Inc Brand Identity Guidelines · Version 3.0 · October 2026. Inter and Montserrat are licensed under the SIL Open Font License. Mohawk, Shaw, Engineered Floors and Lowe’s are trademarks of their respective owners.</p>
</section>
</main>
"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>V &amp; A Flooring Brand Guidelines</title><style>{css}</style></head><body>{body}</body></html>"""

out = ROOT / "docs/va-flooring-brand-guidelines.html"
out.write_text(html)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto(out.as_uri())
    pg.wait_for_timeout(600)
    pg.pdf(path=str(out.with_suffix(".pdf")), format="Letter", print_background=True, scale=0.72,
           margin={"top": "0.4in", "bottom": "0.4in", "left": "0.4in", "right": "0.4in"})
    b.close()
print("wrote", out.name, len(html) // 1024, "KB and PDF")
