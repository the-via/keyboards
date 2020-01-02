---
id: advanced
title: Advanced Sample
sidebar_label: Advanced Sample
---

## M6-B

```json
{
  "name": "RAMA WORKS M6-B",
  "vendorId": "0x5241",
  "productId": "0x006b",
  "lighting": {
    "extends": "wt_rgb_backlight",
    "effects": [
      ["All Off", 0],
      ["Solid Color 1", 1],
      ["Custom Colors", 6],
      ["Gradient Vertical Color 1/2", 2],
      ["Raindrops Color 1/2", 2],
      ["Cycle All", 0],
      ["Cycle Horizontal", 0],
      ["Cycle Vertical", 0],
      ["Jellybean Raindrops", 0],
      ["Radial All Hues", 0],
      ["Radial Color 1", 1]
    ],
    "supportedBacklightValues": [
      9,
      10,
      11,
      12,
      13,
      7,
      8,
      23,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21
    ]
  },
  "matrix": {"rows": 1, "cols": 6},
  "layouts": {
    "keymap": [
      ["0,0", "0,1", "0,2"],
      ["0,3", "0,4", "0,5"]
    ]
  }
}
```

This example is very similar to the M6-A definition with some slight differences. As you can see, the `lighting` property extends the `wt_rgb_backlight` preset and has overriden the `effects` property in order to allow up to 6 colors, it has also overriden the `supportedBacklightValues` to include the id for the `custom_color` config value.
