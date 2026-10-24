"""Residential / ADU: compact kitchen and dining area with pale oak plank flooring."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=0.85)
world("#d9e3ee", 2.2)

W, D, H, T = 5.6, 6.4, 2.75, 0.2
wall = mat("wall", "#eee9e0", 0.85)
ceil = mat("ceiling", "#f5f2ec", 0.9)
floor = tex_mat("tile", "tile", rough_scale=1.0, bump_strength=0.15, coat=0.0)
cab = mat("cab", "#2f4352", 0.55)          # muted navy cabinetry
cabedge = mat("cabedge", "#25374a", 0.5)
counter = mat("counter", "#e9e4da", 0.25)
oakshelf = mat("oakshelf", "#b08a5f", 0.5)
steel = mat("steel", "#b9b9b5", 0.25, metal=1.0)
black = mat("black", "#1f1f1f", 0.4, metal=0.4)
frame = mat("frame", "#2b2b29", 0.35, metal=0.6)
table_w = mat("tablew", "#8a6646", 0.4)
ceramic = mat("ceramic", "#efe9df", 0.3)
ceramic2 = mat("ceramic2", "#7b8a8f", 0.4)
linen = mat("linen", "#d9cfbf", 0.9, sheen=0.3)
ground = mat("ground", "#d3cab9", 0.9)
green = mat("green", "#66755a", 0.9)
twig = mat("twig", "#4a3a2c", 0.8)
glowm = emission("pend", "#ffe7c4", 4.0)

plane_uv("floor", 0, W, -0.6, D, 0, floor, 2.4, offset=(0.1, 0.2))
box("ceiling", -T, W + T, -0.6, D, H, H + 0.12, ceil)
box("ground", -40, 0, -30, 40, -0.3, -0.02, ground)
box("yardwall", -8.2, -8.0, -30, 40, 0, 1.8, mat("stucco", "#e8e2d8", 0.95))
box("yardgreen", -9.5, -8.3, -30, 40, 0, 2.6, green)
box("ground2", -20, 40, D + T, 40, -0.3, -0.02, ground)
box("yardgreen2", -20, 40, D + 6, D + 7, 0, 3.0, green)

# left wall: sliding glass door
slider = (0.9, 3.5, 0.0, 2.4)
wall_x("wallL", 0, -0.6, D, H, T, wall, openings=[slider], outward=-1)
window_frame_x("slider", -0.06, *slider, frame, mullions=[2.2], w=0.05)
area((-0.05, 2.2, 1.2), (0, -90, 0), 2.6, 2.4, energy=10, portal=True, name="portal_slider")
# back wall: window over sink
win = (1.9, 3.3, 1.15, 2.2)
wall_y("wallB", D, -T, W + T, H, T, wall, openings=[win])
window_frame_y("bwin", D + 0.05, *win, frame, mullions=[2.6], w=0.04)
area((2.6, D + 0.05, 1.67), (-90, 0, 0), 1.4, 1.05, energy=10, portal=True, name="portal_win")
wall_x("wallR", W, -0.6, D, H, T, wall)
wall_y("wallF", -0.6, -T, W + T, H, T, wall, outward=-1)

# kitchen run along back wall x 0.9..5.2
kx0, kx1, kd = 0.9, W, 0.62
box("toe", kx0 + 0.05, kx1, D - kd + 0.06, D, 0, 0.1, black)
nfront = 6
fw = (kx1 - kx0) / nfront
for i in range(nfront):
    box(f"front{i}", kx0 + i * fw + 0.003, kx0 + (i + 1) * fw - 0.003, D - kd, D - 0.02, 0.1, 0.88, cab, bevel=0.003)
    box(f"pull{i}", kx0 + i * fw + fw * 0.3, kx0 + i * fw + fw * 0.7, D - kd - 0.02, D - kd, 0.8, 0.815, steel, bevel=0.003)
box("counter", kx0 - 0.02, kx1, D - kd - 0.03, D, 0.88, 0.92, counter, bevel=0.003)
box("splash", kx0 - 0.02, kx1, D - 0.02, D, 0.92, 1.15, counter)
box("sink", 2.3, 2.9, D - 0.5, D - 0.12, 0.885, 0.921, steel)
bar("faucet1", (2.6, D - 0.08, 0.92), (2.6, D - 0.08, 1.22), 0.012, steel)
bar("faucet2", (2.6, D - 0.08, 1.22), (2.6, D - 0.28, 1.22), 0.011, steel)
# right of window: open oak shelves and tall unit
for k, z in enumerate((1.45, 1.85)):
    box(f"shelf{k}", 3.6, W, D - 0.28, D, z, z + 0.035, oakshelf, bevel=0.003)
for k in range(4):
    cyl(f"cup{k}", 3.8 + k * 0.17, D - 0.14, 1.485, 1.58, 0.045, ceramic)
cyl("jar1", 4.7, D - 0.14, 1.885, 2.08, 0.07, ceramic2)
cyl("jar2", 4.95, D - 0.14, 1.885, 2.02, 0.06, ceramic)
cyl("bowl", 4.2, D - 0.33, 0.92, 0.98, 0.13, ceramic)
cyl("vase", 1.35, D - 0.3, 0.92, 1.18, 0.07, ceramic2)
branches("br", 1.35, D - 0.3, 1.16, twig, n=5, height=0.55, seed=8)

# dining
round_table("table", 2.3, 3.1, r=0.55, h=0.75, top=table_w, base=black, thick=0.035)
chair("c1", 1.55, 3.0, -100, table_w)
chair("c2", 2.95, 3.65, 145, table_w)
chair("c3", 2.95, 2.45, 40, table_w)
cyl("pend", 2.3, 3.1, 1.75, 2.02, 0.2, linen, verts=64)
cyl("pendglow", 2.3, 3.1, 1.745, 1.76, 0.19, glowm, verts=64)
bar("cord", (2.3, 3.1, 2.02), (2.3, 3.1, H), 0.004, black)
cyl("fruitbowl", 2.35, 3.15, 0.75, 0.8, 0.15, ceramic)

s = sun((0, 0, 0), strength=3.6, angle_deg=1.0)
d = Vector((1.0, 0.25, -0.55)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')

if os.environ.get("CAM") == "B":
    camera((5.1, 1.7, 1.3), yaw_deg=72, lens=22, shift_y=-0.12)
    render("tile-b.png", preview=PREVIEW)
else:
    camera((4.75, 0.15, 1.3), yaw_deg=24, lens=22, shift_y=-0.12)
    render("tile-kitchen.png", preview=PREVIEW)
