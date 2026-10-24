"""Flooring detail: low-angle close-up of plank seams in raking window light."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scene_lib import *
from mathutils import Vector

PREVIEW = args()
reset()
setup_render(1600, 1067, samples=72, exposure=-0.5)
world("#d9e2ee", 1.6)

wall = mat("wall", "#ece6dc", 0.85)
trim = mat("trim", "#f1ece3", 0.45)
oak = tex_mat("detail", "detail", rough_scale=0.8, bump_strength=0.18, hue_sat=(0.5, 0.95), coat=0.2)
frame = mat("frame", "#2b2b29", 0.35, metal=0.6)

plane_uv("floor", -2, 2, -1, 3, 0, oak, 1.2, offset=(0.13, 0.4))
# wall ahead with baseboard and a window opening to the left producing raking light
wall_y("wallB", 1.6, -3, 3, 2.8, 0.2, wall)
box("bb", -3, 3, 1.58, 1.6, 0, 0.11, trim, bevel=0.003)
wall_x("wallL", -1.2, -1, 1.6, 2.8, 0.2, wall, openings=[(-0.6, 1.0, 0.25, 2.4)], outward=-1)
window_frame_x("win", -1.26, -0.6, 1.0, 0.25, 2.4, frame, mullions=[0.2], w=0.04)
box("ceil", -3, 3, -1, 1.8, 2.8, 2.9, wall)
area((-1.25, 0.2, 1.3), (0, -90, 0), 1.6, 2.15, energy=10, portal=True)

s = sun((0, 0, 0), strength=5.5, angle_deg=0.6)
d = Vector((1.0, -0.35, -0.55)).normalized()
s.rotation_mode = 'QUATERNION'
s.rotation_quaternion = (-d).to_track_quat('Z', 'Y')

camera((0.25, -0.75, 0.62), yaw_deg=10, pitch_deg=-30, lens=45, dof=1.25, fstop=5.6)
render("detail-plank.png", preview=PREVIEW)
