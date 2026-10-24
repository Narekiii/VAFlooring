"""V & A Flooring logo system generator.

The monogram is a V and an A that share one stroke. Strokes follow Baskerville-style
contrast (thick down-strokes, thin up-stroke), so the shared stroke is the thin stroke
of both letters. Every terminal is cut flat and sits on two horizontal lines, like plank
ends aligned on a floor; the A's crossbar is a single short plank.
"""
import json, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
NAVY, IVORY, BRASS, BRONZE, WHITE, GRAPHITE = "#172B3A", "#F7F4EE", "#AA8453", "#75552F", "#FFFFFF", "#303538"


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s == "-0" else s


def poly(pts):
    return "M" + " L".join(f"{fmt(x)} {fmt(y)}" for x, y in pts) + " Z"


# ---------------------------------------------------------------- monogram geometry
def monogram(Wt=24.0, Wn=10.0, slope=0.25, H=100.0, bar_y=(61.0, 70.0), bar_gap=0.0):
    """Returns dict(main=[path...], accent=[path...], width, height). y grows downward."""
    run = slope * H
    L0 = 0.0
    # V left (thick, down-right)
    v_left = [(L0, 0), (L0 + Wt, 0), (L0 + run + Wt, H), (L0 + run, H)]
    # shared stroke (thin, up-right): right edge bottom aligned with V-left right edge bottom
    R1 = L0 + run + Wt
    shared = [(R1 - Wn, H), (R1, H), (R1 + run, 0), (R1 + run - Wn, 0)]
    # A right (thick, down-right): left edge top aligned with shared left edge top
    A0 = R1 + run - Wn
    a_right = [(A0, 0), (A0 + Wt, 0), (A0 + run + Wt, H), (A0 + run, H)]
    # crossbar between shared right edge and A-right left edge
    y0, y1 = bar_y
    def shared_right_x(y):  # right edge of shared stroke: from (R1, H) to (R1+run, 0)
        return R1 + run * (1 - y / H)
    def aright_left_x(y):
        return A0 + run * (y / H)
    bar = [(shared_right_x(y0) - 0.5 + bar_gap, y0), (aright_left_x(y0) + 0.5 - bar_gap, y0),
           (aright_left_x(y1) + 0.5 - bar_gap, y1), (shared_right_x(y1) - 0.5 + bar_gap, y1)]
    width = A0 + run + Wt
    return {"v_left": v_left, "shared": shared, "a_right": a_right, "bar": bar, "width": width, "height": H}


def mono_svg_paths(m, main, accent=None, accent_part="bar", ox=0.0, oy=0.0, s=1.0):
    def tr(pts):
        return [(ox + x * s, oy + y * s) for x, y in pts]
    out = []
    for part in ("v_left", "shared", "a_right", "bar"):
        color = accent if (accent and part == accent_part) else main
        out.append(f'<path fill="{color}" d="{poly(tr(m[part]))}"/>')
    return out


# ---------------------------------------------------------------- text outlining
class Font:
    def __init__(self, path):
        self.f = TTFont(path)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        self.cap = self.f["OS/2"].sCapHeight
        self.hmtx = self.f["hmtx"]
        self.kern = self._kern_pairs()

    def _kern_pairs(self):
        pairs = {}
        try:
            gpos = self.f["GPOS"].table
        except KeyError:
            return pairs
        for lookup in gpos.LookupList.Lookup:
            if lookup.LookupType != 2:
                continue
            for st in lookup.SubTable:
                if st.Format == 1:
                    cov = st.Coverage.glyphs
                    for i, first in enumerate(cov):
                        for pvr in st.PairSet[i].PairValueRecord:
                            v = pvr.Value1.XAdvance if pvr.Value1 and hasattr(pvr.Value1, "XAdvance") else 0
                            if v:
                                pairs[(first, pvr.SecondGlyph)] = v
                elif st.Format == 2:
                    cov = st.Coverage.glyphs
                    cd1, cd2 = st.ClassDef1.classDefs, st.ClassDef2.classDefs
                    for first in cov:
                        c1 = cd1.get(first, 0)
                        rec = st.Class1Record[c1]
                        for second, c2 in list(cd2.items()):
                            v = rec.Class2Record[c2].Value1
                            xa = getattr(v, "XAdvance", 0) if v else 0
                            if xa:
                                pairs.setdefault((first, second), xa)
        return pairs

    def run(self, text, size, tracking=0.0, x=0.0, baseline=0.0, kerning=True):
        """Outline text at font-size `size` (px per em). Returns (path_d, advance_width, ink_bounds)."""
        sc = size / self.upm
        pen = SVGPathPen(self.gs)
        bp = BoundsPen(self.gs)
        cx = 0.0
        prev = None
        for ch in text:
            g = self.cmap[ord(ch)]
            if kerning and prev is not None:
                cx += self.kern.get((prev, g), 0)
            t = (sc, 0, 0, -sc, x + cx * sc, baseline)
            self.gs[g].draw(TransformPen(pen, t))
            self.gs[g].draw(TransformPen(bp, t))
            cx += self.hmtx[g][0] + tracking * self.upm
            prev = g
        adv = (cx - tracking * self.upm) * sc
        return pen.getCommands(), adv, bp.bounds


SERIF_B = Font(os.path.join(HERE, "LibreBaskerville-Bold.ttf"))
SERIF_R = Font(os.path.join(HERE, "LibreBaskerville-Regular.ttf"))
SANS = Font(os.path.join(HERE, "Inter-SemiBold.ttf"))
