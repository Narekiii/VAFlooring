"""Small helper library for building illustrative interior renders with bpy (Cycles, CPU)."""
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "tex")
OUT = os.path.join(HERE, "out")


def srgb(h):
    """hex -> linear RGBA for shader inputs"""
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*lin, 1.0)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def setup_render(w, h, samples=96, exposure=0.0, look="Medium High Contrast", bounces=6):
    s = bpy.context.scene
    samples = int(os.environ.get("SAMPLES", samples))
    s.render.engine = 'CYCLES'
    s.cycles.device = 'CPU'
    s.cycles.samples = samples
    s.cycles.use_adaptive_sampling = True
    s.cycles.adaptive_threshold = 0.015
    s.cycles.use_denoising = True
    try:
        s.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    s.cycles.max_bounces = bounces + 2
    s.cycles.diffuse_bounces = bounces
    s.cycles.glossy_bounces = 4
    s.cycles.transmission_bounces = 8
    s.cycles.transparent_max_bounces = 8
    s.cycles.caustics_reflective = False
    s.cycles.caustics_refractive = False
    s.cycles.blur_glossy = 1.0
    s.cycles.sample_clamp_indirect = 8.0
    s.render.resolution_x = w
    s.render.resolution_y = h
    s.render.resolution_percentage = 100
    s.view_settings.view_transform = 'AgX'
    for name in (look, "AgX - " + look, "None"):
        try:
            s.view_settings.look = name
            break
        except Exception:
            continue
    s.view_settings.exposure = exposure
    s.render.image_settings.file_format = 'PNG'
    s.render.image_settings.color_mode = 'RGB'
    s.render.threads_mode = 'AUTO'


def world(color="#dfe6ee", strength=1.0):
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = srgb(color)
    bg.inputs[1].default_value = strength
    return w


def sun(rot_deg, strength=4.0, angle_deg=1.5, color="#fff1de"):
    d = bpy.data.lights.new("Sun", 'SUN')
    d.energy = strength
    d.angle = math.radians(angle_deg)
    d.color = srgb(color)[:3]
    o = bpy.data.objects.new("Sun", d)
    bpy.context.collection.objects.link(o)
    o.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    return o


def area(loc, rot_deg, size, size_y=None, energy=100, color="#ffffff", portal=False, name="Area"):
    d = bpy.data.lights.new(name, 'AREA')
    d.shape = 'RECTANGLE'
    d.size = size
    d.size_y = size_y or size
    d.energy = energy
    d.color = srgb(color)[:3]
    if portal:
        try:
            d.cycles.is_portal = True
        except Exception:
            pass
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    return o


def point(loc, energy=30, radius=0.05, color="#ffd9a8", name="Point"):
    d = bpy.data.lights.new(name, 'POINT')
    d.energy = energy
    d.shadow_soft_size = radius
    d.color = srgb(color)[:3]
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    return o


def camera(loc, yaw_deg=0.0, pitch_deg=0.0, lens=24, shift_x=0.0, shift_y=0.0, dof=None, fstop=4.0):
    c = bpy.data.cameras.new("Cam")
    c.lens = lens
    c.shift_x = shift_x
    c.shift_y = shift_y
    c.clip_start = 0.02
    c.clip_end = 200
    if dof is not None:
        c.dof.use_dof = True
        c.dof.focus_distance = dof
        c.dof.aperture_fstop = fstop
    o = bpy.data.objects.new("Cam", c)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (math.radians(90 + pitch_deg), 0, math.radians(yaw_deg))
    bpy.context.scene.camera = o
    return o


# ---------------------------------------------------------------- materials
def _new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    return m, nt, bsdf


def mat(name, color, rough=0.5, metal=0.0, spec=0.5, coat=0.0, sheen=0.0):
    m, nt, b = _new_mat(name)
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    try:
        b.inputs["Specular IOR Level"].default_value = spec
    except KeyError:
        pass
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
    return m


def glass(name="Glass", tint="#f2f6f6", rough=0.0):
    m, nt, b = _new_mat(name)
    b.inputs["Base Color"].default_value = srgb(tint)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Transmission Weight"].default_value = 1.0
    b.inputs["IOR"].default_value = 1.45
    return m


def arch_glass(name="ArchGlass", reflect=0.12):
    """Thin architectural glass: transparent for light paths (no caustic darkening) + fresnel reflection."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tr.inputs[0].default_value = (0.92, 0.95, 0.94, 1)
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.02
    fr = nt.nodes.new("ShaderNodeFresnel")
    fr.inputs["IOR"].default_value = 1.5
    mix = nt.nodes.new("ShaderNodeMixShader")
    mth = nt.nodes.new("ShaderNodeMath")
    mth.operation = 'ADD'
    mth.inputs[1].default_value = reflect * 0.3
    nt.links.new(fr.outputs[0], mth.inputs[0])
    nt.links.new(mth.outputs[0], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(gl.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    return m


def task_chair(name, x, y, rot_deg, shell, frame_m, seat_h=0.47):
    parts = []
    parts.append(box(name + "_seat", -0.24, 0.24, -0.23, 0.23, seat_h - 0.06, seat_h, shell, bevel=0.03))
    parts.append(box(name + "_back", -0.22, 0.22, 0.2, 0.26, seat_h + 0.06, seat_h + 0.5, shell, bevel=0.03))
    parts.append(bar(name + "_bk", (0, 0.24, seat_h - 0.02), (0, 0.24, seat_h + 0.1), 0.015, frame_m))
    parts.append(bar(name + "_post", (0, 0, 0.08), (0, 0, seat_h - 0.06), 0.022, frame_m))
    for k in range(5):
        a = k * 2 * math.pi / 5
        parts.append(bar(f"{name}_leg{k}", (0, 0, 0.08), (0.3 * math.cos(a), 0.3 * math.sin(a), 0.04), 0.014, frame_m))
        c = cyl(f"{name}_cast{k}", 0, 0, 0.0, 0.04, 0.022, frame_m, verts=16)
        c.location = (0.3 * math.cos(a), 0.3 * math.sin(a), 0)
        parts.append(c)
    empty = bpy.data.objects.new(name, None)
    _link(empty)
    for p in parts:
        p.parent = empty
    empty.location = (x, y, 0)
    empty.rotation_euler = (0, 0, math.radians(rot_deg))
    return empty


def emission(name, color="#ffe2b8", strength=6.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs[0].default_value = srgb(color)
    em.inputs[1].default_value = strength
    nt.links.new(em.outputs[0], out.inputs[0])
    return m


def tex_mat(name, prefix, rough_scale=1.0, bump_strength=0.12, rough_default=0.45, hue_sat=None,
            sheen=0.0, coat=0.0, value=1.0):
    """Image based material; UVs are expected in texture-tile units."""
    m, nt, b = _new_mat(name)
    col = nt.nodes.new("ShaderNodeTexImage")
    col.image = bpy.data.images.load(os.path.join(TEX, prefix + "_col.png"))
    col.interpolation = 'Cubic'
    src = col.outputs["Color"]
    if hue_sat or value != 1.0:
        hs = nt.nodes.new("ShaderNodeHueSaturation")
        hue, sat = hue_sat or (0.5, 1.0)
        hs.inputs["Hue"].default_value = hue
        hs.inputs["Saturation"].default_value = sat
        hs.inputs["Value"].default_value = value
        nt.links.new(src, hs.inputs["Color"])
        src = hs.outputs["Color"]
    nt.links.new(src, b.inputs["Base Color"])
    rp = os.path.join(TEX, prefix + "_rough.png")
    if os.path.exists(rp):
        r = nt.nodes.new("ShaderNodeTexImage")
        r.image = bpy.data.images.load(rp)
        r.image.colorspace_settings.name = 'Non-Color'
        mul = nt.nodes.new("ShaderNodeMath")
        mul.operation = 'MULTIPLY'
        mul.inputs[1].default_value = rough_scale
        nt.links.new(r.outputs["Color"], mul.inputs[0])
        nt.links.new(mul.outputs[0], b.inputs["Roughness"])
    else:
        b.inputs["Roughness"].default_value = rough_default
    bp = os.path.join(TEX, prefix + "_bump.png")
    if os.path.exists(bp) and bump_strength > 0:
        bi = nt.nodes.new("ShaderNodeTexImage")
        bi.image = bpy.data.images.load(bp)
        bi.image.colorspace_settings.name = 'Non-Color'
        bn = nt.nodes.new("ShaderNodeBump")
        bn.inputs["Strength"].default_value = bump_strength
        bn.inputs["Distance"].default_value = 0.002
        nt.links.new(bi.outputs["Color"], bn.inputs["Height"])
        nt.links.new(bn.outputs["Normal"], b.inputs["Normal"])
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
    if coat:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = 0.15
    try:
        b.inputs["Specular IOR Level"].default_value = 0.5
    except KeyError:
        pass
    return m


# ---------------------------------------------------------------- geometry
def _link(obj):
    bpy.context.collection.objects.link(obj)
    return obj


def box(name, x0, x1, y0, y1, z0, z1, material=None, bevel=0.0, segments=3):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new(name, me))
    if material:
        o.data.materials.append(material)
    if bevel > 0:
        mod = o.modifiers.new("Bevel", 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'NONE'
        mod.harden_normals = False
        for p in me.polygons:
            p.use_smooth = True
    return o


def cyl(name, x, y, z0, z1, r, material=None, verts=48, axis='Z'):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=1.0)
    for v in bm.verts:
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = _link(bpy.data.objects.new(name, me))
    o.location = (x, y, 0)
    if material:
        o.data.materials.append(material)
    return o


def bar(name, p0, p1, r, material=None, verts=16):
    """Cylinder between two points."""
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    L = d.length
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=L)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = _link(bpy.data.objects.new(name, me))
    o.location = (p0 + p1) / 2
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    if material:
        o.data.materials.append(material)
    return o


def plane_uv(name, x0, x1, y0, y1, z, material, tile_m, rotate=False, offset=(0, 0)):
    """Horizontal plane with UVs measured in tile_m units (texture covers tile_m metres)."""
    me = bpy.data.meshes.new(name)
    verts = [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)]
    me.from_pydata(verts, [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name="UVMap")
    for li, loop in enumerate(me.loops):
        x, y, _ = verts[loop.vertex_index]
        u, v = (x + offset[0]) / tile_m, (y + offset[1]) / tile_m
        if rotate:
            u, v = v, u
        uv.data[li].uv = (u, v)
    o = _link(bpy.data.objects.new(name, me))
    o.data.materials.append(material)
    return o


def wall_x(name, x, y0, y1, h, t, material, openings=(), outward=1):
    """Wall in the plane x=const spanning y0..y1. openings: (ya, yb, za, zb). Thickness grows outward."""
    xa, xb = (x, x + t) if outward > 0 else (x - t, x)
    _wall(name, 'x', xa, xb, y0, y1, h, material, openings)


def wall_y(name, y, x0, x1, h, t, material, openings=(), outward=1):
    ya, yb = (y, y + t) if outward > 0 else (y - t, y)
    _wall(name, 'y', ya, yb, x0, x1, h, material, openings)


def _wall(name, axis, a0, a1, s0, s1, h, material, openings):
    ops = sorted(openings)
    cuts = [s0]
    for (oa, ob, za, zb) in ops:
        cuts += [oa, ob]
    cuts.append(s1)
    segs = []
    # solid segments between openings
    for i in range(0, len(cuts), 2):
        if cuts[i + 1] - cuts[i] > 1e-4:
            segs.append((cuts[i], cuts[i + 1], 0, h))
    for (oa, ob, za, zb) in ops:
        if za > 0:
            segs.append((oa, ob, 0, za))
        if zb < h:
            segs.append((oa, ob, zb, h))
    for k, (sa, sb, za, zb) in enumerate(segs):
        if axis == 'x':
            box(f"{name}_{k}", a0, a1, sa, sb, za, zb, material)
        else:
            box(f"{name}_{k}", sa, sb, a0, a1, za, zb, material)


def window_frame_x(name, x, ya, yb, za, zb, material, mullions=(), transoms=(), w=0.05, depth=0.08):
    box(name + "_l", x - depth / 2, x + depth / 2, ya, ya + w, za, zb, material)
    box(name + "_r", x - depth / 2, x + depth / 2, yb - w, yb, za, zb, material)
    box(name + "_b", x - depth / 2, x + depth / 2, ya, yb, za, za + w, material)
    box(name + "_t", x - depth / 2, x + depth / 2, ya, yb, zb - w, zb, material)
    for i, m in enumerate(mullions):
        box(f"{name}_m{i}", x - depth / 2, x + depth / 2, m - w / 2, m + w / 2, za, zb, material)
    for i, tz in enumerate(transoms):
        box(f"{name}_t{i}", x - depth / 2, x + depth / 2, ya, yb, tz - w / 2, tz + w / 2, material)


def window_frame_y(name, y, xa, xb, za, zb, material, mullions=(), transoms=(), w=0.05, depth=0.08):
    box(name + "_l", xa, xa + w, y - depth / 2, y + depth / 2, za, zb, material)
    box(name + "_r", xb - w, xb, y - depth / 2, y + depth / 2, za, zb, material)
    box(name + "_b", xa, xb, y - depth / 2, y + depth / 2, za, za + w, material)
    box(name + "_t", xa, xb, y - depth / 2, y + depth / 2, zb - w, zb, material)
    for i, m in enumerate(mullions):
        box(f"{name}_m{i}", m - w / 2, m + w / 2, y - depth / 2, y + depth / 2, za, zb, material)
    for i, tz in enumerate(transoms):
        box(f"{name}_t{i}", xa, xb, y - depth / 2, y + depth / 2, tz - w / 2, tz + w / 2, material)


# ---------------------------------------------------------------- furniture
def sofa(name, x, y, w=2.3, d=0.95, h=0.78, fabric=None, leg=None, facing='-x'):
    """Sofa aligned to axes. (x,y) = centre of footprint. facing = direction the seat faces."""
    objs = []
    if facing in ('-x', '+x'):
        sx, sy = d, w
    else:
        sx, sy = w, d
    x0, x1, y0, y1 = x - sx / 2, x + sx / 2, y - sy / 2, y + sy / 2
    base_h, seat_h = 0.14, 0.43
    arm_w, back_d = 0.16, 0.22

    def B(n, a0, a1, b0, b1, z0, z1, bev, mt):
        # coordinates expressed in local (u along width, v along depth from back)
        if facing == '-x':
            X0, X1 = x1 - b1, x1 - b0
            Y0, Y1 = y0 + a0, y0 + a1
        elif facing == '+x':
            X0, X1 = x0 + b0, x0 + b1
            Y0, Y1 = y1 - a1, y1 - a0
        elif facing == '-y':
            X0, X1 = x0 + a0, x0 + a1
            Y0, Y1 = y1 - b1, y1 - b0
        else:
            X0, X1 = x1 - a1, x1 - a0
            Y0, Y1 = y0 + b0, y0 + b1
        objs.append(box(f"{name}_{n}", X0, X1, Y0, Y1, z0, z1, mt, bevel=bev))

    B("base", 0.02, w - 0.02, 0.02, d - 0.02, base_h, seat_h - 0.12, 0.02, fabric)
    B("back", arm_w, w - arm_w, 0.0, back_d, seat_h - 0.12, h, 0.05, fabric)
    B("armL", 0.0, arm_w, 0.0, d, base_h, 0.62, 0.05, fabric)
    B("armR", w - arm_w, w, 0.0, d, base_h, 0.62, 0.05, fabric)
    n = 2
    cw = (w - 2 * arm_w) / n
    for i in range(n):
        B(f"seat{i}", arm_w + i * cw + 0.005, arm_w + (i + 1) * cw - 0.005, back_d, d, seat_h - 0.12, seat_h, 0.05, fabric)
        B(f"cush{i}", arm_w + i * cw + 0.01, arm_w + (i + 1) * cw - 0.01, back_d - 0.0, back_d + 0.17, seat_h, h - 0.04, 0.07, fabric)
    for (a, b) in ((0.08, 0.08), (w - 0.08, 0.08), (0.08, d - 0.08), (w - 0.08, d - 0.08)):
        B(f"leg{a}{b}", a - 0.02, a + 0.02, b - 0.02, b + 0.02, 0.0, base_h, 0.005, leg)
    return objs


def round_table(name, x, y, r=0.5, h=0.38, top=None, base=None, thick=0.04):
    cyl(name + "_top", x, y, h - thick, h, r, top, verts=96)
    cyl(name + "_base", x, y, 0.0, h - thick, r * 0.55, base, verts=96)


def chair(name, x, y, rot_deg, wood, seat_mat=None, seat_h=0.46):
    """Simple modern dining chair; built then rotated about z."""
    parts = []
    s = 0.44
    parts.append(box(name + "_seat", -s / 2, s / 2, -s / 2, s / 2, seat_h - 0.035, seat_h, seat_mat or wood, bevel=0.01))
    for (a, b) in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        parts.append(bar(f"{name}_leg{a}{b}", (a * (s / 2 - 0.03), b * (s / 2 - 0.03), 0), (a * (s / 2 - 0.035), b * (s / 2 - 0.035), seat_h - 0.03), 0.016, wood))
    for a in (-1, 1):
        parts.append(bar(f"{name}_post{a}", (a * (s / 2 - 0.035), s / 2 - 0.035, seat_h), (a * (s / 2 - 0.035), s / 2 - 0.02, 0.84), 0.014, wood))
    parts.append(box(name + "_back", -s / 2 + 0.02, s / 2 - 0.02, s / 2 - 0.045, s / 2 - 0.01, 0.66, 0.82, wood, bevel=0.008))
    for p in parts:
        p.parent = None
    empty = bpy.data.objects.new(name, None)
    _link(empty)
    for p in parts:
        p.parent = empty
    empty.location = (x, y, 0)
    empty.rotation_euler = (0, 0, math.radians(rot_deg))
    return empty


def branches(name, x, y, z, material, n=7, seed=3, height=0.7):
    import random
    rnd = random.Random(seed)
    for i in range(n):
        a = rnd.uniform(0, 2 * math.pi)
        tilt = rnd.uniform(0.05, 0.35)
        L = height * rnd.uniform(0.7, 1.1)
        p0 = Vector((x, y, z))
        p1 = p0 + Vector((math.cos(a) * tilt * L, math.sin(a) * tilt * L, L))
        bar(f"{name}_{i}", p0, p1, 0.004, material, verts=6)
        for j in range(3):
            t = rnd.uniform(0.4, 0.9)
            q0 = p0.lerp(p1, t)
            b = a + rnd.uniform(-1.2, 1.2)
            q1 = q0 + Vector((math.cos(b) * 0.12, math.sin(b) * 0.12, rnd.uniform(0.05, 0.15)))
            bar(f"{name}_{i}_{j}", q0, q1, 0.0025, material, verts=5)


def render(path, preview=False):
    s = bpy.context.scene
    if preview:
        s.render.resolution_percentage = 30
        s.cycles.samples = 16
    s.render.filepath = os.path.join(OUT, path)
    bpy.ops.render.render(write_still=True)
    print("RENDERED", s.render.filepath)


def args():
    return "--preview" in sys.argv
