"""Multifamily: apartment lobby / common lounge with long wood-look planks and resident mailboxes."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=1.0)
world("#d6e0ec", 2.0)

W, D, H, T = 8.0, 8.6, 3.3, 0.25
wall = mat("wall", "#e9e4da", 0.85)
ceil = mat("ceiling", "#f3f0ea", 0.9)
floor = tex_mat("greyoak", "greyoak", rough_scale=0.8, bump_strength=0.06, hue_sat=(0.5, 0.62), coat=0.12, value=1.12)
frame = mat("frame", "#2a2c2d", 0.35, metal=0.6)
bronze = mat("bronze", "#94806a", 0.32, metal=0.85)
bronze2 = mat("bronze2", "#665443", 0.4, metal=0.85)
wood = mat("wood", "#8c6a4a", 0.45)
fabric = mat("fabric", "#b9ad9a", 0.95, sheen=0.3)
fabric2 = mat("fabric2", "#34495a", 0.95, sheen=0.3)
black = mat("black", "#1f1f1f", 0.4, metal=0.4)
stone = mat("stone", "#cfc6b8", 0.5)
ground = mat("ground", "#cfc8bc", 0.9)
green = mat("green", "#5f6d55", 0.9)
glowm = emission("glow", "#fff0d8", 6.0)
ceramic = mat("ceramic", "#e8e1d4", 0.4)
twig = mat("twig", "#4a3a2c", 0.8)

plane_uv("floor", 0, W, -0.5, D, 0, floor, 3.2, rotate=False)
box("ceiling", -T, W + T, -0.5, D, H, H + 0.15, ceil)
box("ground", -40, 0, -30, 40, -0.3, -0.02, ground)
box("across", -22, -20, -30, 40, 0, 12.0, mat("bldg", "#e4ded3", 0.9))
for k in range(14):
    box(f"accw{k}", -20.0, -19.97, -20 + k * 4.2, -18.2 + k * 4.2, 1.2, 10.5, mat(f"accg{k}", "#c9d0d5", 0.6))

# storefront glazing on the left wall
store = (0.6, D - 0.6, 0.0, 3.0)
wall_x("wallL", 0, -0.5, D, H, T, wall, openings=[store], outward=-1)
mull = [0.6 + k * (D - 1.2) / 5 for k in range(1, 5)]
window_frame_x("store", -0.06, *store, frame, mullions=mull, transoms=[2.45], w=0.06, depth=0.12)
area((-0.05, D / 2, 1.5), (0, -90, 0), D - 1.2, 3.0, energy=10, portal=True, name="portal")
wall_y("wallB", D, -T, W + T, H, T, wall)
wall_x("wallR", W, -0.5, D, H, T, wall)
wall_y("wallF", -0.5, -T, W + T, H, T, wall, outward=-1)

# resident mailboxes on the right wall
mx0, my0, my1, mz0, mz1 = W - 0.12, 2.4, 6.0, 0.55, 1.95
box("mb_back", mx0, W, my0 - 0.06, my1 + 0.06, mz0 - 0.06, mz1 + 0.06, bronze2)
cols, rows = 10, 6
cw, rh = (my1 - my0) / cols, (mz1 - mz0) / rows
for c in range(cols):
    for r in range(rows):
        ya, yb = my0 + c * cw + 0.006, my0 + (c + 1) * cw - 0.006
        za, zb = mz0 + r * rh + 0.006, mz0 + (r + 1) * rh - 0.006
        box(f"mb{c}_{r}", mx0 - 0.012, mx0, ya, yb, za, zb, bronze, bevel=0.002)
        box(f"mbk{c}_{r}", mx0 - 0.02, mx0 - 0.012, yb - 0.05, yb - 0.035, (za + zb) / 2 - 0.008, (za + zb) / 2 + 0.008, black)
# parcel counter below
box("bench_r", W - 0.55, W, 6.5, 7.9, 0.0, 0.92, wood, bevel=0.004)
box("bench_r_top", W - 0.6, W, 6.45, 7.95, 0.92, 0.96, stone, bevel=0.004)

# back wall: feature slats behind seating
for k in range(26):
    xx = 1.2 + k * 0.16
    box(f"slat{k}", xx, xx + 0.07, D - 0.08, D, 0.0, H, wood, bevel=0.003)
# lounge group
sofa("sofa", 3.2, D - 1.0, w=2.6, d=0.95, fabric=fabric, leg=black, facing='-y')
round_table("ct", 3.2, D - 2.4, r=0.5, h=0.38, top=stone, base=black)
for (cx, cy, rot) in ((1.6, D - 2.6, -60), (4.8, D - 2.7, 60)):
    o = []
    box(f"lc{cx}_s", cx - 0.38, cx + 0.38, cy - 0.38, cy + 0.38, 0.2, 0.42, fabric2, bevel=0.05)
    box(f"lc{cx}_b", cx - 0.38, cx + 0.38, cy + 0.22, cy + 0.38, 0.42, 0.78, fabric2, bevel=0.05)
cyl("vase", 3.25, D - 2.35, 0.38, 0.6, 0.08, ceramic)
branches("br", 3.25, D - 2.35, 0.58, twig, n=6, height=0.6, seed=4)
# pendants
for k in range(3):
    px = 2.4 + k * 0.8
    bar(f"cord{k}", (px, D - 2.4, 2.5 - k * 0.15), (px, D - 2.4, H), 0.004, black)
    cyl(f"pd{k}", px, D - 2.4, 2.32 - k * 0.15, 2.5 - k * 0.15, 0.12, bronze2, verts=48)
    cyl(f"pdg{k}", px, D - 2.4, 2.315 - k * 0.15, 2.325 - k * 0.15, 0.11, glowm, verts=48)
# linear ceiling lights
for k in range(3):
    yy = 2.0 + k * 3.0
    box(f"lin{k}", 5.6, 8.2, yy - 0.03, yy + 0.03, H - 0.01, H, glowm)
# entry mat area? keep floor clear

s = sun((0, 0, 0), strength=3.4, angle_deg=1.0)
d = Vector((1.0, 0.35, -0.7)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')

camera((6.6, 0.3, 1.3), yaw_deg=21, lens=21, shift_y=-0.1)
render("multifamily-lobby.png", preview=PREVIEW)
