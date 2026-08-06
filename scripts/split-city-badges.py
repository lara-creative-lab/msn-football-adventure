#!/usr/bin/env python3
"""Split the generated 5x2 city-badge master into square transparent assets."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/concepts/generated/city-badges-production-master-transparent-2026.png"
OUTPUT = ROOT / "public/assets/city-badges"
NAMES = [
    "city-badge-1990-rome.png",
    "city-badge-1994-pasadena.png",
    "city-badge-1998-paris.png",
    "city-badge-2002-yokohama.png",
    "city-badge-2006-berlin.png",
    "city-badge-2010-cape-town.png",
    "city-badge-2014-rio.png",
    "city-badge-2018-moscow.png",
    "city-badge-2022-doha.png",
    "city-badge-2026-united.png",
]
SIZE = 320
PADDING = 14


def keep_largest_component(image: Image.Image) -> Image.Image:
    """Discard disconnected slivers that crossed a generated grid boundary."""
    alpha = image.getchannel("A")
    width, height = image.size
    visible = bytearray(1 if value > 20 else 0 for value in alpha.getdata())
    visited = bytearray(width * height)
    components: list[list[int]] = []

    for start, value in enumerate(visible):
        if not value or visited[start]:
            continue
        stack = [start]
        visited[start] = 1
        component: list[int] = []
        while stack:
            point = stack.pop()
            component.append(point)
            x, y = point % width, point // width
            for next_y in range(max(0, y - 1), min(height, y + 2)):
                for next_x in range(max(0, x - 1), min(width, x + 2)):
                    neighbor = next_y * width + next_x
                    if visible[neighbor] and not visited[neighbor]:
                        visited[neighbor] = 1
                        stack.append(neighbor)
        components.append(component)

    keep = set(max(components, key=len))
    pixels = list(image.getdata())
    image.putdata([pixel if index in keep else (*pixel[:3], 0) for index, pixel in enumerate(pixels)])
    return image


def main() -> None:
    master = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    cell_width = master.width / 5
    cell_height = master.height / 2

    for index, name in enumerate(NAMES):
        column = index % 5
        row = index // 5
        bounds = (
            round(column * cell_width),
            round(row * cell_height),
            round((column + 1) * cell_width),
            round((row + 1) * cell_height),
        )
        cell = keep_largest_component(master.crop(bounds))
        alpha_bounds = cell.getchannel("A").getbbox()
        if alpha_bounds is None:
            raise RuntimeError(f"No visible badge pixels found for {name}")
        badge = cell.crop(alpha_bounds)
        scale = min((SIZE - PADDING * 2) / badge.width, (SIZE - PADDING * 2) / badge.height)
        target = (max(1, round(badge.width * scale)), max(1, round(badge.height * scale)))
        badge = badge.resize(target, Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        canvas.alpha_composite(badge, ((SIZE - target[0]) // 2, (SIZE - target[1]) // 2))
        canvas.save(OUTPUT / name, optimize=True)


if __name__ == "__main__":
    main()
