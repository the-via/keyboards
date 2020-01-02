---
id: simple
title: Simple Example
sidebar_label: Simple Example
---

M6-A

```json
{
  "name": "RAMA WORKS M6-A",
  "vendorId": "0x5241",
  "productId": "0x006a",
  "lighting": "none",
  "matrix": {"rows": 1, "cols": 6},
  "layouts": {
    "keymap": [
      [{"c": "#505557", "t": "#d9d7d7", "a": 7}, "0,0", "0,1", "0,2"],
      ["0,3", "0,4", "0,5"]
    ]
  }
}
```

You can write JSX and use React components within your Markdown thanks to [MDX](https://mdxjs.com/).

export const Highlight = ({children, color}) => ( <span style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}> {children} </span> );

<Highlight color="#25c2a0">Docusaurus green</Highlight> and <Highlight color="#1877F2">Facebook blue</Highlight> are my favorite colors.

I can write **Markdown** alongside my _JSX_!
