"""Commercial: open office with quarter-turn carpet tile and a glass-walled meeting room."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=0.6)
world("#d8e1ec", 2.0)

W, D, H, T = 10.0, 12.0, 3.0, 0.25
wall = mat("wall", "#ebe7e0", 0.85)
ceil = mat("ceiling", "#f2f0ec", 0.9)
carpet = tex_mat("carpet", "office", bump_strength=0.3, sheen=0.1, value=1.05)
frame = mat("frame", "#2a2c2d", 0.35, metal=0.6)
gl = arch_glass("glass")
desk = mat("desk", "#e8e3da", 0.35)
oak = mat("oak", "#a88560", 0.45)
black = mat("black", "#232323", 0.4, metal=0.4)
fabric = mat("fabric", "#3a4c5b", 0.9, sheen=0.3)
fabric2 = mat("fabric2", "#a99c88", 0.9, sheen=0.3)
glowm = emission("glow", "#fff6ea", 8.0)
ground = mat("ground", "#d1cbc0", 0.9)
screen = mat("screen", "#1b1f22", 0.2)
plant = mat("plant", "#5a6a4f", 0.8)
pot = mat("pot", "#d8d0c3", 0.6)

plane_uv("floor", 0, W, -0.5, D, 0, carpet, 2.0)
box("ceiling", -T, W + T, -0.5, D, H, H + 0.12, ceil)
box("ground", -40, 60, D, 60, -0.3, -0.02, ground)
box("bldg", -40, 60, D + 25, D + 27, 0, 30, mat("bldg", "#e1dbd0", 0.9))
for k in range(20):
    box(f"bw{k}", -30 + k * 4.5, -27.5 + k * 4.5, D + 24.98, D + 25.0, 1.5, 28, mat(f"bwg{k}", "#c6cdd3", 0.6))

# back wall: ribbon windows
wins = [(0.4 + k * 2.4, 2.6 + k * 2.4, 0.75, 2.6) for k in range(4)]
wall_y("wallB", D, -T, W + T, H, T, wall, openings=wins)
for i, w_ in enumerate(wins):
    window_frame_y(f"w{i}", D + 0.06, *w_, frame, mullions=[(w_[0] + w_[1]) / 2], w=0.05)
    area(((w_[0] + w_[1]) / 2, D + 0.05, 1.67), (-90, 0, 0), w_[1] - w_[0], 1.85, energy=10, portal=True, name=f"p{i}")
wall_x("wallL", 0, -0.5, D, H, T, wall, outward=-1)
wall_x("wallR", W, -0.5, D, H, T, wall)
wall_y("wallF", -0.5, -T, W + T, H, T, wall, outward=-1)

# glass meeting room on the right: x 6.6..W, y 3.0..8.0
gx, gy0, gy1 = 6.6, 3.2, 8.4
for yy in (gy0, gy0 + 1.3, gy0 + 2.6, gy0 + 3.9, gy1):
    box(f"gm{yy}", gx - 0.02, gx + 0.02, yy - 0.015, yy + 0.015, 0, H, frame)
box("gtop", gx - 0.02, gx + 0.02, gy0, gy1, H - 0.05, H, frame)
box("gtop2", gx, W, gy0 - 0.02, gy0 + 0.02, H - 0.05, H, frame)
box("gbot2", gx, W, gy0 - 0.02, gy0 + 0.02, 0, 0.04, frame)
for xx in (7.9, 9.2):
    box(f"gmx{xx}", xx - 0.015, xx + 0.015, gy0 - 0.02, gy0 + 0.02, 0, H, frame)
box("film", gx - 0.003, gx + 0.003, gy0, gy1, 1.0, 1.18, mat("film", "#e9e6e0", 0.6))
box("gbot", gx - 0.02, gx + 0.02, gy0, gy1, 0, 0.04, frame)
box("mtable", 7.4, 9.4, 4.6, 7.0, 0.72, 0.76, oak, bevel=0.004)
box("mtable_leg1", 8.3, 8.5, 4.9, 5.1, 0, 0.72, black)
box("mtable_leg2", 8.3, 8.5, 6.5, 6.7, 0, 0.72, black)
for k, yy in enumerate((4.9, 5.8, 6.7)):
    task_chair(f"mc{k}", 7.0, yy, -90, fabric, black)

# open desks: two rows of benching on the left/centre
for r, yy in enumerate((5.0, 8.4)):
    box(f"desk{r}", 1.0, 5.4, yy - 0.75, yy + 0.75, 0.72, 0.75, desk, bevel=0.003)
    box(f"screen_div{r}", 1.0, 5.4, yy - 0.01, yy + 0.01, 0.75, 1.1, fabric2)
    for leg in (1.05, 3.2, 5.3):
        box(f"dl{r}{leg}", leg - 0.03, leg + 0.03, yy - 0.7, yy + 0.7, 0.0, 0.72, black)
    for k, xx in enumerate((1.7, 3.2, 4.7)):
        for side in (-1, 1):
            # monitor
            box(f"mon{r}{k}{side}", xx - 0.28, xx + 0.28, yy + side * 0.32 - 0.01, yy + side * 0.32 + 0.01, 0.95, 1.28, screen, bevel=0.003)
            bar(f"mst{r}{k}{side}", (xx, yy + side * 0.34, 0.75), (xx, yy + side * 0.34, 0.97), 0.012, black)
            task_chair(f"ch{r}{k}{side}", xx + 0.1 * side, yy + side * 1.0, (0 if side < 0 else 180) + 12 * side * (k - 1), fabric, black)
# linear pendants
for k in range(4):
    yy = 2.0 + k * 2.6
    box(f"lin{k}", 1.2, 5.2, yy - 0.025, yy + 0.025, H - 0.42, H - 0.38, glowm)
    bar(f"lc{k}a", (1.4, yy, H - 0.38), (1.4, yy, H), 0.003, black)
    bar(f"lc{k}b", (5.0, yy, H - 0.38), (5.0, yy, H), 0.003, black)
    area((3.2, yy, H - 0.43), (0, 0, 0), 4.0, 0.06, energy=120, color="#fff6ea", name=f"la{k}")

s = sun((0, 0, 0), strength=3.0, angle_deg=1.0)
d = Vector((0.4, -1.0, -0.7)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')

camera((5.2, 0.2, 1.4), yaw_deg=4, lens=21, shift_y=-0.12)
render("commercial-office.png", preview=PREVIEW)
