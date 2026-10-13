"""Build Home's fixed-center climate views from the published V3 archive.

Usage: python scripts/build-climate-maps.py path/to/koppen_geiger_tif.zip
Requires numpy, Pillow and rasterio. This is an optional asset-generation tool.
"""

import json
import re
import sys
import zipfile
from pathlib import Path

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.transform import from_bounds
from rasterio.warp import reproject

ROOT = Path(__file__).resolve().parent.parent
RASTER = "1991_2020/koppen_geiger_0p00833333.tif"


def build(archive_path):
    home = json.loads((ROOT / "public/data/sections/home.json").read_text(encoding="utf-8"))
    config = next(item["map"] for article in home["articles"] for item in article["items"]
                  if item.get("map", {}).get("type") == "climate")
    width, height = config["imageWidth"], config["imageHeight"]
    palette = np.zeros((256, 3), dtype=np.uint8)
    with zipfile.ZipFile(archive_path) as archive:
        for line in archive.read("legend.txt").decode("utf-8").splitlines():
            match = re.match(r"\s*(\d+):.*\[(\d+) (\d+) (\d+)\]", line)
            if match:
                palette[int(match[1])] = [int(value) for value in match.groups()[1:]]

    radius = 6378137
    center_x = radius * np.radians(config["longitude"])
    center_y = radius * np.arcsinh(np.tan(np.radians(config["latitude"])))
    with rasterio.open(f"zip://{Path(archive_path).resolve().as_posix()}!{RASTER}") as source:
        for zoom, image_path in config["imagesByZoom"].items():
            resolution = 2 * np.pi * radius / (256 * 2 ** int(zoom))
            transform = from_bounds(
                center_x - width * resolution / 2, center_y - height * resolution / 2,
                center_x + width * resolution / 2, center_y + height * resolution / 2,
                width, height,
            )
            classes = np.zeros((height, width), dtype=np.uint8)
            reproject(
                source=rasterio.band(source, 1), destination=classes,
                src_transform=source.transform, src_crs=source.crs,
                dst_transform=transform, dst_crs="EPSG:3857",
                resampling=Resampling.nearest,
            )
            # Preserve categorical colors. Class 0 (water/no data) is transparent.
            image = Image.fromarray(classes)
            image.putpalette(palette.flatten().tolist())
            output = ROOT / "public" / image_path
            output.parent.mkdir(parents=True, exist_ok=True)
            image.save(output, transparency=0, optimize=True)
            print(f"{output.relative_to(ROOT)}: {output.stat().st_size:,} bytes")


if __name__ == "__main__":
    build(sys.argv[1])
