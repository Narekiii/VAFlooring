"""Hero: residential living room with wide-plank oak, afternoon light from tall windows."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1200, samples=96, exposure=0.95)
world("#d6e1ee", 2.2)

W, D, H, T = 6.2, 8.0, 3.0, 0.2
wall = mat("wall", "#ebe5da", 0.85)
ceil = mat("ceiling", "#f4f1ea", 0.9)
trim = mat("trim", "#efe9df", 0.5)
frame = mat("frame", "#2b2b29", 0.35, metal=0.6)
oak = tex_mat("oak", "oak", rough_scale=0.85, bump_strength=0.08, hue_sat=(0.5, 0.8), coat=0.15, value=1.04)
fabric = mat("fabric", "#56636c", 0.95, sheen=0.4)
walnut = mat("walnut", "#5b3f2b", 0.45)
stone = mat("stone", "#d8cfbf", 0.55)
black = mat("black", "#1d1d1d", 0.4, metal=0.5)
linen = mat("linen", "#e7dfd0", 0.95, sheen=0.3)
canvas = mat("canvas", "#e9e2d4", 0.9)
navy = mat("navy", "#24394a", 0.9)
brass = mat("brass", "#a07c4f", 0.85)
ceramic = mat("ceramic", "#c9bba3", 0.5)
twig = mat("twig", "#4a3a2c", 0.8)
ground = mat("ground", "#cfc5b2", 0.9)
hedge = mat("hedge", "#5f6f52", 0.9)

# floor & exterior ground
plane_uv("floor", 0, W, -0.5, D, 0, oak, 3.2, offset=(0.37, 0.11))
box("ground", -40, 0, -20, 30, -0.3, -0.02, ground)
box("gwall", -7.2, -7.0, -10, 20, 0, 1.9, mat("stucco", "#e6e0d5", 0.95))
box("hedge", -8.5, -7.3, -10, 20, 0, 2.6, hedge)

# window wall (x=0) with three floor-to-ceiling openings
wins = [(0.9, 2.5, 0.0, 2.65), (3.1, 4.7, 0.0, 2.65), (5.3, 6.9, 0.0, 2.65)]
wall_x("wallL", 0, -0.5, D, H, T, wall, openings=wins, outward=-1)
for i, (ya, yb, za, zb) in enumerate(wins):
    window_frame_x(f"win{i}", -0.06, ya, yb, za, zb, frame, mullions=[(ya + yb) / 2], transoms=[2.1], w=0.045)
    area((-0.05, (ya + yb) / 2, 1.33), (0, -90, 0), yb - ya, 2.65, energy=10, portal=True, name=f"portal{i}")
    box(f"sill{i}", -0.2, 0.0, ya, yb, 0, 0.02, frame)
wall_x("wallR", W, -0.5, D, H, T, wall)
wall_y("wallB", D, -T, W + T, H, T, wall)
wall_y("wallF", -0.5, -T, W + T, H, T, wall, outward=-1)
box("ceiling", -T, W + T, -0.5, D, H, H + 0.15, ceil)
# baseboards
box("bbR", W - 0.016, W, -0.5, D, 0, 0.09, trim)
box("bbB", 0, W, D - 0.016, D, 0, 0.09, trim)

# back wall: credenza, artwork, branches
box("cred", 1.3, 3.7, D - 0.48, D - 0.02, 0.12, 0.62, walnut, bevel=0.008)
box("cred_plinth", 1.4, 3.6, D - 0.44, D - 0.06, 0.0, 0.12, black)
for k in range(3):
    box(f"cred_gap{k}", 1.3 + 0.8 * (k + 1) - 0.004, 1.3 + 0.8 * (k + 1) + 0.004, D - 0.485, D - 0.47, 0.14, 0.6, black)
box("art", 1.75, 3.25, D - 0.04, D - 0.01, 1.05, 2.1, canvas)
box("art_a", 1.95, 2.55, D - 0.045, D - 0.04, 1.25, 1.9, navy)
cyl("art_b", 2.85, D - 0.045, 0, 0.004, 0.24, brass).rotation_euler = (math.radians(90), 0, 0)
bpy.data.objects["art_b"].location = (2.8, D - 0.045, 1.52)
cyl("vase", 3.35, D - 0.25, 0.62, 0.94, 0.09, ceramic)
branches("br", 3.35, D - 0.25, 0.92, twig, n=6, height=0.75)
cyl("bowl", 1.75, D - 0.24, 0.62, 0.69, 0.14, stone)

# seating group on the right, facing the windows
sofa("sofa", W - 0.62, 4.6, w=2.5, d=1.0, fabric=fabric, leg=black, facing='-x')
round_table("ctable", 3.9, 4.6, r=0.52, h=0.36, top=stone, base=stone)
cyl("book1", 3.75, 4.5, 0.36, 0.40, 0.13, navy)
# lounge chair near windows
box("lc_seat", 1.55, 2.25, 4.15, 4.95, 0.22, 0.42, linen, bevel=0.06)
box("lc_back", 1.45, 1.65, 4.15, 4.95, 0.22, 0.82, linen, bevel=0.06)
for yy in (4.2, 4.9):
    box(f"lc_frame{yy}", 1.45, 2.3, yy - 0.015, yy + 0.015, 0.0, 0.25, walnut, bevel=0.005)
# floor lamp beside sofa
cyl("lamp_base", W - 0.45, 3.0, 0, 0.02, 0.16, black)
cyl("lamp_pole", W - 0.45, 3.0, 0.02, 1.45, 0.012, black)
cyl("lamp_shade", W - 0.45, 3.0, 1.45, 1.75, 0.22, linen)
# side table
cyl("side_top", W - 0.5, 6.35, 0.48, 0.5, 0.24, walnut)
cyl("side_leg", W - 0.5, 6.35, 0.0, 0.48, 0.025, black)

# low afternoon sun from the window side
s = sun((0, 0, 0), strength=3.9, angle_deg=1.2)
d = Vector((1.0, -0.45, -0.62)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')

if os.environ.get("CAM") == "WIDE":
    bpy.context.scene.render.resolution_x = 2400
    bpy.context.scene.render.resolution_y = 1050
    camera((3.05, 0.25, 1.2), yaw_deg=5, lens=20, shift_y=-0.13)
    render("hero-wide.png", preview=PREVIEW)
elif os.environ.get("CAM") == "B":
    camera((5.35, 1.15, 1.25), yaw_deg=58, lens=24, shift_y=-0.1)
    render("living-b.png", preview=PREVIEW)
else:
    camera((3.05, 0.35, 1.2), yaw_deg=6, lens=21, shift_y=-0.15)
    render("hero-living.png", preview=PREVIEW)
