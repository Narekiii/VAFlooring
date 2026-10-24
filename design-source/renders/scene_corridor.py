"""Hospitality: hotel guest corridor with patterned broadloom-style carpet."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=-0.25)
world("#e9e4dc", 0.6)

Wd, L, H, T = 2.1, 26.0, 2.75, 0.2
x0, x1 = -Wd / 2, Wd / 2
wallc = mat("wallcovering", "#dcd6cb", 0.8)
ceil = mat("ceiling", "#f3efe7", 0.9)
carpet = tex_mat("carpet", "hotel", bump_strength=0.25, sheen=0.12, value=1.0)
door = mat("door", "#5a4536", 0.42)
dframe = mat("dframe", "#4a3d32", 0.4)
base = mat("base", "#3a3029", 0.5)
brassm = mat("brassm", "#a38157", 0.35, metal=0.9)
glow = emission("glow", "#ffdcae", 8.0)
down = emission("down", "#fff1dc", 25.0)
panel = mat("panel", "#d8ccb8", 0.7)

plane_uv("floor", x0, x1, -1, L, 0, carpet, 1.5, offset=(0.75, 0.0))
box("ceiling", x0 - T, x1 + T, -1, L, H, H + 0.1, ceil)
# far window
wall_y("endwall", L, x0 - T, x1 + T, H, T, wallc, openings=[(-0.55, 0.55, 0.9, 2.3)])
window_frame_y("endwin", L + 0.05, -0.55, 0.55, 0.9, 2.3, dframe, mullions=[0.0], w=0.04)
area((0, L + 0.3, 1.6), (90, 0, 0), 1.1, 1.4, energy=40, portal=False, color="#fff6ea", name="endglow")
wall_y("backwall", -1, x0 - T, x1 + T, H, T, wallc, outward=-1)

doors_y = [2.6, 7.1, 11.6, 16.1, 20.6]
for side, xw in (("L", x0), ("R", x1)):
    sgn = -1 if side == "L" else 1
    opens = []
    for i, dy in enumerate(doors_y):
        dy2 = dy + (2.25 if side == "R" else 0)
        opens.append((dy2 - 0.6, dy2 + 0.6, 0, 2.35))
    if side == "L":
        wall_x("wall" + side, xw, -1, L, H, T, wallc, openings=opens, outward=-1)
    else:
        wall_x("wall" + side, xw, -1, L, H, T, wallc, openings=opens, outward=1)
    for i, (ya, yb, za, zb) in enumerate(opens):
        rec = 0.18
        xd = xw + sgn * rec
        # alcove sides & head
        box(f"al{side}{i}a", min(xw, xd), max(xw, xd), ya - 0.02, ya, 0, zb, wallc)
        box(f"al{side}{i}b", min(xw, xd), max(xw, xd), yb, yb + 0.02, 0, zb, wallc)
        box(f"al{side}{i}h", min(xw, xd), max(xw, xd), ya, yb, zb, zb + 0.02, wallc)
        # frame and leaf
        box(f"fr{side}{i}", min(xd, xd + sgn * 0.04), max(xd, xd + sgn * 0.04), ya, yb, 0, zb, dframe)
        box(f"dr{side}{i}", min(xd - sgn * 0.045, xd), max(xd - sgn * 0.045, xd), ya + 0.07, yb - 0.07, 0.01, zb - 0.07, door, bevel=0.004)
        hy = yb - 0.17 if side == "L" else ya + 0.17
        box(f"hd{side}{i}", min(xd - sgn * 0.11, xd - sgn * 0.045), max(xd - sgn * 0.11, xd - sgn * 0.045), hy - 0.012, hy + 0.012, 1.0, 1.03, brassm, bevel=0.004)
        box(f"hb{side}{i}", min(xd - sgn * 0.11, xd - sgn * 0.08), max(xd - sgn * 0.11, xd - sgn * 0.08), hy - 0.012, hy + 0.15, 1.0, 1.03, brassm, bevel=0.004)
        # room number plate on wall next to door
        py = ya - 0.25
        box(f"pl{side}{i}", min(xw - sgn * 0.012, xw), max(xw - sgn * 0.012, xw), py - 0.07, py + 0.07, 1.48, 1.62, brassm)
        # sconce between doors
        sy = yb + 1.05
        if sy < L - 1:
            box(f"sc{side}{i}", min(xw - sgn * 0.09, xw), max(xw - sgn * 0.09, xw), sy - 0.07, sy + 0.07, 1.55, 1.95, glow, bevel=0.01)
            point((xw - sgn * 0.16, sy, 1.75), energy=10, radius=0.06, name=f"scl{side}{i}")
    # baseboard
    xb = xw - sgn * 0.015
    box("base" + side, min(xb, xw), max(xb, xw), -1, L, 0, 0.12, base)
    # wainscot reveal line

for k in range(10):
    yy = 1.2 + k * 2.4
    cyl(f"dl{k}", 0, yy, H - 0.005, H, 0.07, down, verts=32)
    point((0, yy, H - 0.08), energy=55, radius=0.04, color="#fff1e0", name=f"dlp{k}")

if os.environ.get("CAM") == "B":
    camera((0.62, 3.6, 1.3), yaw_deg=21, pitch_deg=-17, lens=27, dof=3.2, fstop=5.6)
    render("corridor-b.png", preview=PREVIEW)
else:
    camera((0.12, 0.2, 1.48), yaw_deg=0.0, lens=23, shift_y=-0.12)
    render("hospitality-corridor.png", preview=PREVIEW)
