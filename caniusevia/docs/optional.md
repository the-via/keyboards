---
id: optional
title: Optional Properties
sidebar_label: Optional Properties
---

## Lighting

```json
{
  ...
  "lighting": {
    ...
    "extends": "none",
    ...
  },
  ...
}
```

The object must contain the `extends` key which contains one of the preset names and optionally can include following keys. The other keys defined in the object will override the properties defined in the preset. `the-via/reader` contains the defined values for each preset.

```json
{
  ...
  "lighting": {
    ...
    "effects": [
      ["Solid Color 1", 1],
      ["Cycle All", 0]
    ...
    ],
  },
  ...
}
```

The `effects` property is an array comprised of tuples that are made up of a `string` that is the effect label and the `number` of colors that the effect requires.

```json
{
  ...
  "lighting": {
    ...
    "keycodes": "wt",
    ...
  },
  ...
}
```

The `keycodes` property can either be `qmk` or `wt` which controls what keycodes the keyboard uses to control the lighting. This maps to what is displayed in the keymap tab.

```json
{
  ...
  "lighting": {
    ...
    "supportedBacklightValues": [
      10, // Effect
      11  // Effect Speed
    ]
    ...
  },
  ...
}
```

The `supportedBacklightValues` property is an array of all backlight commands supported by the keyboard. This defines what is shown in the Lighting tab for the user to control. An exhaustive list of values are defined in the `the-via/reader` package.

## Layouts

```json
{
  ...
  "layouts": {
    ...
    "presets": {"HHKB": [1, 0, 0, 1, 2]},
    "labels": [
      "Split Backspace",
      "ISO",
      "Split Left Shift",
      "Split Right Shift",
      ["Bottom Row", "ANSI", "7U", "HHKB", "WKL"]
    ],
    ...
  }
  ...
}
```

The `labels` property is an optional array of `string` or `string[]` and defines the labels for the layout controls.

The order of the labels is important as the implicit index is used to map to the group number e.g. `Split Backspace` corresponds to group 0, `ISO` corresponds to group 1, etc.

If an item in the `labels` array is a `string` it maps to **option 0** and **option 1** and is presented as a toggle button. If it a `string[]` it maps to a select control with the first item in the array being used as the label for the control and the following items being used as labels of option `n` e.g. for the `Bottom Row` control, `ANSI` maps to **option 0**, `7U` maps to **option 1** etc.
