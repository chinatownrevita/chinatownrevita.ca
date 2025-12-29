import os, json

SITE_DIR = os.path.dirname(os.path.abspath(__file__))

FOLDERS = {
  "ctad": "assets/ctad",
  "cleanups": "assets/cleanups",
  "mahjong": "assets/mahjong",
  "hope-stoves": "assets/hope-stoves",
}

IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def list_images(rel_folder):
  folder = os.path.join(SITE_DIR, rel_folder)
  if not os.path.isdir(folder):
    return []
  files = []
  for fn in os.listdir(folder):
    ext = os.path.splitext(fn)[1].lower()
    if ext in IMG_EXTS:
      files.append(fn)
  files.sort(key=lambda s: s.lower())
  return [f"{rel_folder}/{fn}" for fn in files]

manifest = {"hero": [], "projects": {k: [] for k in FOLDERS.keys()}}

for key, rel in FOLDERS.items():
  manifest["projects"][key] = list_images(rel)

# Hero: take first 3 CTAD images (you can reorder by renaming files)
ctad_imgs = manifest["projects"]["ctad"]
manifest["hero"] = ctad_imgs[:3]

out_path = os.path.join(SITE_DIR, "manifest.json")
with open(out_path, "w", encoding="utf-8") as f:
  json.dump(manifest, f, indent=2)

print("Wrote manifest.json")
print("Hero images:", manifest["hero"])
for k,v in manifest["projects"].items():
  print(k, "images:", len(v))
