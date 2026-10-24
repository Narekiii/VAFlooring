"""Procedural flooring textures for the illustrative renders (numpy only)."""
import numpy as np
from scipy.ndimage import gaussian_filter, zoom
from PIL import Image
import os, sys

OUT = os.path.join(os.path.dirname(__file__), "tex")
rng = np.random.default_rng(1999)

def fbm(h, w, sy, sx, octaves=3, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    acc = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = r.standard_normal((h, w))
        n = gaussian_filter(n, (sy / (2 ** o), sx / (2 ** o)), mode="wrap")
        n /= (n.std() + 1e-9)
        acc += amp * n; tot += amp; amp *= 0.5
    return acc / tot

def wood_planks(name, size_m, px, plank_w, plank_l, base, var, grain_strength=0.10,
                seam_dark=0.55, ring_freq=40.0, knots=0.0, seed=0, len_jitter=0.35,
                bevel_px=2, y_start=None):
    """Planks run along the image V axis (rows). base = linear-ish sRGB 0..1 triple."""
    r = np.random.default_rng(seed)
    ppm = px / size_m
    pw = int(round(plank_w * ppm))
    ncols = int(np.ceil(px / pw))
    W = ncols * pw
    H = px
    col = np.zeros((H, W, 3), np.float32)
    bump = np.zeros((H, W), np.float32)
    rough = np.zeros((H, W), np.float32)
    for c in range(ncols):
        y = -r.uniform(0, plank_l * ppm) if y_start is None else y_start
        while y < H:
            L = plank_l * ppm * r.uniform(1 - len_jitter, 1.0)
            y0, y1 = int(max(0, y)), int(min(H, y + L))
            if y1 - y0 > 4:
                h = y1 - y0
                # grain: strongly anisotropic noise plus warped growth rings
                g = fbm(h, pw, sy=max(8, h / 6), sx=1.2, octaves=3, seed=r.integers(1e9))
                warp = fbm(h, pw, sy=h / 3, sx=pw / 2, octaves=2, seed=r.integers(1e9))
                xs = np.arange(pw)[None, :] / pw
                rings = np.sin(2 * np.pi * (xs * ring_freq * r.uniform(0.6, 1.4) + warp * 2.2 + r.uniform(0, 1)))
                rings = np.sign(rings) * np.abs(rings) ** 3
                tone = 1 + r.normal(0, var)
                hue = np.array([1 + r.normal(0, var * 0.35), 1, 1 - r.normal(0, var * 0.25)])
                fine = fbm(h, pw, sy=h / 30, sx=0.8, octaves=2, seed=r.integers(1e9))
                lum = tone * (1 + grain_strength * (0.55 * g + 0.35 * rings + 0.25 * fine))
                c3 = np.clip(np.array(base)[None, None, :] * hue[None, None, :] * lum[..., None], 0, 1)
                if knots > 0 and r.random() < knots:
                    ky, kx = r.uniform(0.2, 0.8) * h, r.uniform(0.25, 0.75) * pw
                    yy, xx = np.mgrid[0:h, 0:pw]
                    d = ((yy - ky) / (pw * 0.18)) ** 2 + ((xx - kx) / (pw * 0.07)) ** 2
                    c3 *= (1 - 0.35 * np.exp(-d))[..., None]
                col[y0:y1, c * pw:(c + 1) * pw] = c3
                bump[y0:y1, c * pw:(c + 1) * pw] = 0.5 + 0.08 * g + 0.05 * rings
                rough[y0:y1, c * pw:(c + 1) * pw] = 0.42 + 0.06 * fine + r.normal(0, 0.03)
                # end joint (butt seam)
                for yy_ in (y0, y1 - 1):
                    if 0 < yy_ < H - 1:
                        for k in range(bevel_px):
                            f = seam_dark + (1 - seam_dark) * (k / bevel_px)
                            for yk in (yy_ - k, yy_ + k):
                                if 0 <= yk < H:
                                    col[yk, c * pw:(c + 1) * pw] *= f if k == 0 else 1 - (1 - f) * 0.5
                                    bump[yk, c * pw:(c + 1) * pw] = 0.5 * (k / bevel_px) + 0.1
            y += L
        # long edge seams
        for k in range(bevel_px):
            f = seam_dark + (1 - seam_dark) * (k / bevel_px)
            for xk in (c * pw + k, (c + 1) * pw - 1 - k):
                col[:, xk] *= f
                bump[:, xk] = 0.1 + 0.4 * (k / bevel_px)
    col = col[:, :px]; bump = bump[:, :px]; rough = rough[:, :px]
    save(name, col, bump, rough)

def save(name, col, bump=None, rough=None):
    Image.fromarray((np.clip(col, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)).save(f"{OUT}/{name}_col.png")
    if bump is not None:
        Image.fromarray((np.clip(bump, 0, 1) * 255).astype(np.uint8)).save(f"{OUT}/{name}_bump.png")
    if rough is not None:
        Image.fromarray((np.clip(rough, 0, 1) * 255).astype(np.uint8)).save(f"{OUT}/{name}_rough.png")
    print("saved", name, col.shape)

def hex3(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])

def hotel_carpet(name, px=2048, tile_m=1.2):
    """Repeat tile: staggered 'running bond' bars, muted navy/sand/bronze, with pile noise."""
    navy, sand, bronze, ground = hex3('#24394a'), hex3('#c9bca6'), hex3('#7d6142'), hex3('#33475a')
    img = np.zeros((px, px, 3)) + ground
    yy, xx = np.mgrid[0:px, 0:px] / px
    rows = 6
    rh = 1 / rows
    for i in range(rows):
        off = 0.5 * (i % 2)
        in_row = (yy >= i * rh + rh * 0.18) & (yy < (i + 1) * rh - rh * 0.18)
        u = (xx * 2 + off) % 1.0
        bar = in_row & (u > 0.06) & (u < 0.94)
        img[bar] = navy
        line = in_row & (((u > 0.06) & (u < 0.075)) | ((u > 0.925) & (u < 0.94)))
        img[line] = bronze
        mid = (np.abs(yy - (i + 0.5) * rh) < rh * 0.025) & (u > 0.12) & (u < 0.88)
        img[mid] = sand * 0.85
    pile = fbm(px, px, 1.0, 1.0, octaves=2) * 0.06 + fbm(px, px, 6, 6, octaves=2) * 0.04
    img = img * (1 + pile[..., None])
    bump = 0.5 + pile * 3
    rough = np.full((px, px), 0.92)
    save(name, img, bump, rough)

def carpet_tile(name, px=2048, tiles=4):
    """50cm carpet tiles, quarter-turned, fine linear texture."""
    t = px // tiles
    base = hex3('#5d6872'); alt = hex3('#56626c')
    img = np.zeros((px, px, 3)); bump = np.zeros((px, px))
    r = np.random.default_rng(7)
    for i in range(tiles):
        for j in range(tiles):
            n = fbm(t, t, 0.6, 14, octaves=2, seed=r.integers(1e9))
            stripes = 0.5 + 0.5 * np.sin(np.arange(t)[None, :] * 2 * np.pi / (t / 34))
            tex = 0.10 * n + 0.07 * stripes
            if (i + j) % 2: tex = tex.T
            c = (base if (i * 3 + j) % 5 else alt) * (1 + tex[..., None])
            c[:2] *= 0.82; c[-2:] *= 0.82; c[:, :2] *= 0.82; c[:, -2:] *= 0.82
            img[i * t:(i + 1) * t, j * t:(j + 1) * t] = c
            bump[i * t:(i + 1) * t, j * t:(j + 1) * t] = 0.5 + tex * 2
    save(name, img, bump, np.full((px, px), 0.95))

def tile_grid(name, px=2048, n=4, base='#d8d2c6'):
    img = np.zeros((px, px, 3)); t = px // n
    b = hex3(base)
    r = np.random.default_rng(3)
    for i in range(n):
        for j in range(n):
            v = fbm(t, t, 30, 30, 3, seed=r.integers(1e9)) * 0.03
            img[i*t:(i+1)*t, j*t:(j+1)*t] = b * (1 + r.normal(0, 0.015)) * (1 + v[..., None])
    for k in range(n):
        img[k*t:k*t+3] = b * 0.8; img[:, k*t:k*t+3] = b * 0.8
    save(name, img)

if __name__ == "__main__":
    which = sys.argv[1:] or ["oak", "lightoak", "greyoak", "detail", "hotel", "office"]
    if "oak" in which:      # warm natural oak, wide plank (residential hero)
        wood_planks("oak", 3.2, 4096, 0.22, 1.85, base=(0.70, 0.52, 0.34), var=0.06, seed=11, knots=0.25)
    if "lightoak" in which: # pale oak (ADU)
        wood_planks("lightoak", 3.2, 4096, 0.18, 1.50, base=(0.78, 0.64, 0.47), var=0.045, seed=21, grain_strength=0.08, knots=0.1)
    if "greyoak" in which:  # weathered grey-brown (lobby)
        wood_planks("greyoak", 3.2, 4096, 0.23, 2.00, base=(0.60, 0.53, 0.45), var=0.05, seed=31, grain_strength=0.09)
    if "detail" in which:   # high-res oak for close-up
        wood_planks("detail", 1.2, 4096, 0.22, 1.85, base=(0.68, 0.52, 0.36), var=0.05, seed=12, knots=0.0, bevel_px=6, ring_freq=30)
    if "hotel" in which:
        hotel_carpet("hotel")
    if "office" in which:
        carpet_tile("office")


def samples():
    tones = {"smp_oak": (0.66, 0.51, 0.35), "smp_pale": (0.80, 0.70, 0.56), "smp_greige": (0.66, 0.61, 0.54),
             "smp_walnut": (0.38, 0.27, 0.19), "smp_smoke": (0.52, 0.46, 0.40)}
    for i, (n, b) in enumerate(tones.items()):
        wood_planks(n, 0.62, 1536, 0.62, 10.0, base=b, var=0.0, seed=40 + i, ring_freq=95, len_jitter=0.0,
                    grain_strength=0.11, bevel_px=3, y_start=-10)


if __name__ == "__main__" and "samples" in sys.argv:
    samples()
