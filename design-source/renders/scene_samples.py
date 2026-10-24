"""Materials: flooring sample boards and carpet swatches laid out for selection."""
import sys, os, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=-0.5)
world("#ebe7e0", 1.2)

table = mat("table", "#ddd5c7", 0.75)
wall = mat("wall", "#ece6dc", 0.85)
edge = mat("edge", "#3b2f25", 0.6)
backing = mat("backing", "#cfc6b6", 0.95)
mats = {
    "oak": tex_mat("s_oak", "smp_oak", bump_strength=0.08, coat=0.15),
    "light": tex_mat("s_light", "smp_pale", bump_strength=0.06, coat=0.1),
    "grey": tex_mat("s_grey", "smp_greige", bump_strength=0.06, coat=0.1),
    "dark": tex_mat("s_dark", "smp_walnut", bump_strength=0.08, coat=0.2),
    "smoke": tex_mat("s_smoke", "smp_smoke", bump_strength=0.06, coat=0.1),
    "hotel": tex_mat("s_hotel", "hotel", bump_strength=0.3, sheen=0.15),
    "office": tex_mat("s_office", "office", bump_strength=0.35, sheen=0.1),
}


def sample(name, w, l, t, top, x, y, rot, z=0.0, tile=3.2, uo=(0.0, 0.0), side=edge):
    me_top = plane_uv(name + "_top", -w / 2, w / 2, -l / 2, l / 2, t, top, tile, offset=uo)
    body = box(name + "_body", -w / 2, w / 2, -l / 2, l / 2, 0.0, t - 0.0005, side, bevel=0.0008, segments=2)
    for o in (me_top, body):
        o.location = (x, y, z)
        o.rotation_euler = (0, 0, math.radians(rot))


box("table", -1.5, 1.5, -1.2, 1.2, -0.04, 0.0, table)
wall_y("wall", 1.2, -3, 3, 2.0, 0.1, wall)
plane_uv("dummy", 5, 6, 5, 6, -1, table, 1)

# fan of plank samples
pw = {"oak": 0.22, "light": 0.18, "grey": 0.23, "dark": 0.22, "smoke": 0.23}
specs = [("oak", -0.44, 0.02, 14, 3), ("light", -0.24, 0.12, 6, 5), ("grey", -0.03, 0.08, -1, 2),
         ("dark", 0.19, 0.14, -7, 7), ("smoke", 0.41, 0.0, -15, 4)]
for i, (k, x, y, rot, col) in enumerate(specs):
    w = 0.15
    sample(f"pl{i}", w, 0.6, 0.012 + 0.004 * (i % 2), mats[k], x, y, rot, z=0.003 * i, tile=0.62, uo=(0.31, 0.31))
# carpet swatches in front, slightly overlapping
sample("cp1", 0.34, 0.34, 0.014, mats["hotel"], -0.17, -0.4, 7, z=0.02, tile=0.7, uo=(0.2, 0.1), side=backing)
sample("cp2", 0.34, 0.34, 0.012, mats["office"], 0.2, -0.43, -10, z=0.02, tile=2.0, uo=(0.08, 0.07), side=backing)

s = sun((0, 0, 0), strength=3.2, angle_deg=4.0)
d = Vector((0.8, 0.45, -0.75)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')
area((-1.6, -0.6, 1.4), (0, -60, 0), 1.6, 1.2, energy=70, color="#fbf6ee")

camera((0.02, -1.25, 0.95), yaw_deg=0, pitch_deg=-38, lens=50, dof=1.35, fstop=6.3)
render("materials-samples.png", preview=PREVIEW)
