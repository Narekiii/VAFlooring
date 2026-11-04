"""Transform the supplied V & A product data into compact website data.
Inputs: VA_Products.json (supplied). Outputs: public/catalog/<category>.json and src/content/catalog.generated.json."""
import json, re, sys, collections, pathlib, hashlib
SRC = pathlib.Path(sys.argv[1]); SITE = pathlib.Path(sys.argv[2])
d = json.load(open(SRC / "VA_Products.json"))
CITY = {"AlanaFloor":"City of Industry","Bel Air Flooring":"Los Angeles","Eternity Flooring":"Pacoima","Garrison Collection":"Van Nuys",
 "Golden State Floors":"Anaheim","Hallmark Floors":"Ontario","Johnson Hardwood":"City of Industry","Lions Floor":"Paramount",
 "Monarch Plank":"Southern California","MSI":"Orange","National Flooring Products":"Ontario","Naturally Aged Flooring":"Moorpark",
 "Oasis Wood Flooring":"City of Industry","Provenza Floors":"Tustin","Republic Floor":"Commerce","Reward Flooring":"Santa Fe Springs",
 "Tecsun Flooring":"City of Industry","Tropical Flooring":"El Monte","Urbanfloor":"City of Industry","Xtreme Performance Flooring":"Irwindale",
 "Diamond Perspective":"Irwindale","Timbre Hardwood":"Irwindale"}
TRUE_FLOORS = {"Xtreme Performance Flooring","Diamond Perspective","Timbre Hardwood"}
CAT = {"Engineered Hardwood":"hardwood","Solid Hardwood":"hardwood","Hardwood — Construction Unspecified":"hardwood",
       "Laminate":"laminate","Luxury Vinyl":"vinyl","Hybrid Flooring":"vinyl","Tile & Stone":"tile"}
SUB = {"Engineered Hardwood":"Engineered","Solid Hardwood":"Solid","Hybrid Flooring":"Hybrid"}
BANNED = re.compile(r"\b(water[\s-]?proof|scratch[\s-]?proof|lifetime warranty)\b", re.I)
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def brand_of(p):
    if p["catalog_supplier"] == "Golden State Floors" and p["brand"] == "GoldenStateFloors": return "Golden State Floors"
    return p["brand"] if p["brand"] == p["catalog_supplier"] else None

def clean(s):
    if not s: return None
    s = BANNED.sub("", str(s)); s = re.sub(r"\s{2,}", " ", s).strip(" -|,/·")
    return s or None

def spec(v, maxlen=34):
    v = clean(v)
    if not v or len(v) > maxlen or re.search(r"add to cart|find a pro|room scene|\$", v, re.I) or v.startswith("/"): return None
    return v

def coll_of(p, b):
    c = p.get("collection")
    if c and not c.strip().endswith(":"):
        c = re.sub(r"[™®©]", "", clean(c) or "").strip()
        return c.title() if c.isupper() else (c or None)
    n0 = p["name"]
    if " / " in n0 and not re.match(r"\s*(gold|silver) label", n0, re.I): return clean(n0.split(" / ")[0])
    n = p.get("parent_product_name") or p["name"]
    m = re.search(r"([A-Z][\w’'&.\s]{1,40}?) Collection", n.replace(b, ""))
    return clean(m.group(1)) if m else None

def title_of(p, b, coll):
    clr = clean(p.get("color"))
    if clr and re.search(r"information|details|specs?$|^(shade|colou?r|default|n/?a|title)$", clr, re.I): clr = None
    n = clean(p["name"]) or ""
    if not clr and coll and n.lower().startswith(b.lower()):
        rest = n[len(b):].strip()
        if rest.lower().startswith(coll.lower()): rest = rest[len(coll):].strip()
        sku = str(p.get("sku") or "")
        if sku and rest.endswith(sku): rest = rest[: -len(sku)].strip()
        if rest: n = rest
    if clr and len(clr) <= 40 and not re.search(r"\d+(\.\d+)?\s*(sq|mm|\")", clr): t = clr
    else:
        t = n.split(" — ")[-1] if " — " in n else n
        t = re.sub(r"^" + re.escape(b) + r"\s*", "", t)
        t = re.split(r"\s+\d|\s+-\s+|\(", t)[0] if len(t) > 48 else t
    t = re.sub(r"^(Clearance|Gold Label|Silver Label)\s*/\s*", "", t).strip(" -|/")
    if " / " in t: t = t.split(" / ")[-1]
    sku = str(p.get("sku") or "")
    t = re.sub(r"\s+[-–]\s+(" + re.escape(b) + "|Urban Floor|" + (re.escape(sku) if sku else "\\b\\B") + r")\s*$", "", t, flags=re.I).strip()
    return polish(t, b, coll)

TYPEWORDS = re.compile(r"\s*(engineered hardwood flooring|engineered hardwood|solid hardwood flooring|hardwood flooring|"
    r"hybrid rigid core flooring|rigid core flooring|luxury vinyl planks?|luxury vinyl tiles?|vinyl planks?|laminate flooring|"
    r"spc flooring|wpc flooring)\s*$", re.I)
def polish(t, b, coll):
    t = re.sub(r"[™®©]", "", t)
    t = re.sub(r"\s*-?\s*coming soon\s*$", "", t, flags=re.I)
    if ":" in t: t = t.split(":")[-1].strip() or t
    if t.lower().startswith("products |"): t = t.split("|")[-1]
    t = re.sub(r"\s*[–-]\s*" + re.escape(b) + r"\s*$", "", t.strip(), flags=re.I)
    t = TYPEWORDS.sub("", re.sub(r"\s{2,}", " ", t)).strip(" -|–/,")
    words = t.split()
    if sum(w.isupper() and len(w) > 2 for w in words) >= 2: t = " ".join(w.capitalize() if w.isupper() and len(w) > 2 else w for w in words)
    return t.title() if t.isupper() else t

WALL = re.compile(r"\bwall\b|wall[- ]?chic|wall[- ]?covering|underlayment|stair|nosing|molding|moulding|trim\b|reducer", re.I)

BADIMG = re.compile(r"\.svg($|\?)|shopping-cart|logo|placeholder|icon", re.I)
def image_of(p):
    cands = [p.get("image_url")] + [i.get("url") if isinstance(i, dict) else i for i in (p.get("images") or [])]
    words = [w.lower() for w in re.findall(r"[A-Za-z]{4,}", p.get("color") or p["name"])][:3]
    for i in p.get("source_images") or []:
        a = (i.get("alt") or "").lower()
        if a and any(w in a for w in words) and not re.search(r"logo|icon|cart", a): cands.append(i.get("url"))
    for u in cands:
        if u and u.startswith("http") and not BADIMG.search(u): return u.replace("http://", "https://", 1) if "tecsunflooring" not in u else u
    return None

recs, seen = [], set()
for p in d["products"]:
    b = brand_of(p)
    if not b or p["record_level"] == "sample" or p["category"] not in CAT or not p.get("image_url"): continue
    if re.match(r"\s*(clearance|hidden)\b", p["name"], re.I): continue
    if WALL.search(" ".join(str(p.get(k) or "") for k in ("name", "parent_product_name", "color", "collection", "image_url"))): continue
    img = image_of(p)
    if not img: continue
    coll = coll_of(p, b)
    t = title_of(p, b, coll)
    if not t or re.search(r"^about\b|crafted for|timeless living|^products?$|^home$", t, re.I) or len(t) > 60: continue
    key = (b, (coll or "").lower(), t.lower(), p.get("sku") or "")
    if key in seen: continue
    seen.add(key)
    r = {"id": p["id"], "b": slug(b), "c": CAT[p["category"]], "t": t, "img": img}
    if coll and coll.lower() != t.lower(): r["col"] = coll
    if p.get("sku"): r["sku"] = str(p["sku"])[:32]
    s = {}
    for k, lab in [("construction", "Construction"), ("species", "Species"), ("width", "Width"), ("thickness", "Thickness"),
                   ("length", "Length"), ("wear_layer", "Wear layer"), ("finish", "Finish"), ("installation", "Installation")]:
        v = spec(p.get(k))
        if v: s[lab] = v
    if p["category"] in SUB and "Construction" not in s: s["Construction"] = SUB[p["category"]]
    if s: r["s"] = s
    recs.append(r)

# An image shared by several different floors isn't product-specific: keep it only on the floor it names;
# the others are listed without a photo rather than with the wrong one.
by_img = collections.defaultdict(list)
for r in recs: by_img[r["img"]].append(r)
drop = set()
for u, rs in by_img.items():
    if len({r["t"].lower() for r in rs}) < 2: continue
    fname = re.sub(r"[^a-z0-9]", "", u.lower().rsplit("/", 1)[-1])
    for r in rs:
        if re.sub(r"[^a-z0-9]", "", r["t"].lower()) not in fname: drop.add(r["id"])
print("listed without photo (shared image):", len(drop), collections.Counter(r["b"] for r in recs if r["id"] in drop))
for r in recs:
    if r["id"] in drop: del r["img"]
recs.sort(key=lambda r: (r["b"], "img" not in r, r.get("col") or "~", r["t"]))
out = SITE / "public" / "catalog"; out.mkdir(parents=True, exist_ok=True)
for c in ["hardwood", "laminate", "vinyl", "tile"]:
    json.dump([r for r in recs if r["c"] == c], open(out / f"{c}.json", "w"), separators=(",", ":"), ensure_ascii=False)

brands = {}
for r in recs:
    B = brands.setdefault(r["b"], {"cats": collections.Counter(), "cols": collections.Counter(), "n": 0})
    B["n"] += 1; B["cats"][r["c"]] += 1; B["cols"][r.get("col") or ""] += 1
names = {slug(n): n for n in CITY}
summary = {"asOf": d.get("as_of") or "2026-11-04", "total": len(recs), "byCategory": dict(collections.Counter(r["c"] for r in recs)), "brands": []}
for s_, B in sorted(brands.items(), key=lambda x: names[x[0]].lower()):
    feat = []
    for c, _ in B["cats"].most_common():
        pool = [r for r in recs if r["b"] == s_ and r["c"] == c and "img" in r]
        feat += pool[:: max(1, len(pool) // 4)][:4]
    summary["brands"].append({"slug": s_, "name": names[s_], "city": CITY[names[s_]],
        "distributor": "True Floors" if names[s_] in TRUE_FLOORS else None,
        "count": B["n"], "categories": dict(B["cats"]),
        "collections": [c for c, _ in B["cols"].most_common() if c][:40],
        "featured": feat[:8]})
json.dump(summary, open(SITE / "src" / "content" / "catalog.generated.json", "w"), indent=1, ensure_ascii=False)
print(len(recs), summary["byCategory"], [(b["name"], b["count"]) for b in summary["brands"]])
for c in ["hardwood", "laminate", "vinyl", "tile"]: print(c, (out / f"{c}.json").stat().st_size // 1024, "KB")
