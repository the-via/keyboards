#!/usr/bin/env python3

import os
import json
import collections


def reorder_and_format(file_path):
    with open(file_path, "r+") as f:
        data = json.load(f, object_pairs_hook=collections.OrderedDict)

        if "matrix" in data:
            matrix = data["matrix"]
            if list(matrix.keys()) == ["cols", "rows"]:
                matrix = {"rows": matrix["rows"], "cols": matrix["cols"]}
                data["matrix"] = matrix

        if "layouts" in data:
            layouts = data["layouts"]
            ordered_layouts = collections.OrderedDict()
            layout_order = ["labels", "presets", "keymap"]

            for key in layout_order:
                if key in layouts:
                    ordered_layouts[key] = layouts[key]

            data["layouts"] = ordered_layouts

        ordered_data = collections.OrderedDict()
        key_order = [
            "name",
            "vendorId",
            "productId",
            "firmwareVersion",
            "matrix",
            "customFeatures",
            "customKeycodes",
            "keycodes",
            "menus",
            "lighting",
            "layouts",
        ]

        for key in key_order:
            if key in data:
                ordered_data[key] = data[key]

        f.seek(0)
        json.dump(ordered_data, f, indent=2, ensure_ascii=False)
        f.write("\n")  # insert final newline
        f.truncate()


def walk_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                reorder_and_format(os.path.join(root, file))


def main():
    # Get the directory containing the script
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Define the project directories relative to the script directory
    src_dir = os.path.join(script_dir, "..", "src")
    v3_dir = os.path.join(script_dir, "..", "v3")

    # Use the dynamic paths
    walk_directory(src_dir)
    walk_directory(v3_dir)


if __name__ == "__main__":
    main()
