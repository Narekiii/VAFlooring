"""Convert renders to web JPEGs for the site (src/assets/images)."""
import sys, os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "out")
DST = os.path.join(HERE, "..", "..", "src", "assets", "images")
mapping = {
    "hero-wide.png": "residential-living-room-wide.jpg",
    "living-b.png": "residential-living-room-windows.jpg",
    "residential-adu.png": "residential-adu-kitchen.jpg",
    "adu-b.png": "residential-adu-dining.jpg",
    "hospitality-corridor.png": "hospitality-corridor.jpg",
    "corridor-b.png": "hospitality-corridor-carpet.jpg",
    "multifamily-lobby.png": "multifamily-lobby.jpg",
    "commercial-office.png": "commercial-office.jpg",
    "detail-plank.png": "oak-plank-detail.jpg",
    "materials-samples.png": "flooring-samples.jpg",
}
os.makedirs(DST, exist_ok=True)
for src, dst in mapping.items():
    p = os.path.join(SRC, src)
    if not os.path.exists(p):
        print("missing", src); continue
    im = Image.open(p).convert("RGB")
    im.save(os.path.join(DST, dst), "JPEG", quality=86, optimize=True, progressive=True, subsampling="4:2:0")
    print(dst, im.size, os.path.getsize(os.path.join(DST, dst)) // 1024, "KB")
