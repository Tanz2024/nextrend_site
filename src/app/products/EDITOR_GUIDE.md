# Product Content Editor Guide (Non-Programmer Friendly)

This guide explains how to edit product content without touching code.
You only change the JSON content files (text + image/PDF filenames). The site builds the rest.

Where to edit
- Main file: src/app/products/EDITOR_GUIDE.md (this guide)
- Brand content files live in folders like:
  - src/app/products/brionvega/content.json
  - src/app/products/trinnov/content.json
  - src/app/products/bearbricks/content.json
  - src/app/products/amina/content/*.json
  - src/app/products/k-array/content/*.json
  - src/app/products/k-gear/content/*.json
  - src/app/products/frogis/content/*.json

Uploads (images / PDFs)
- Upload product images and PDFs to the brand folder in the R2 bucket.
- Use ONLY the filename in JSON, not a full URL.
  - Example: "radiofonografo_drawing.pdf" (not https://...)

Required fields (every product)
- name: Product name shown on the page
- slug: URL name (lowercase, no spaces). Example: "radiofonografo-60th-anniversary"
- headline: Short label shown near title
- description: Short paragraph under title
- series: Model number line
- image: Main image filename

Optional fields (add if you have them)
- story: Long description / background
- heroCopy: Short hero overlay line
- specs: Bullet list of technical information
- features: Bullet list of product highlights
- applications: Bullet list of use cases
- resources: Downloadable files (manuals, drawings, brochures)
- gallery: Extra images (non-finish)
- lifestyle: Scene images with captions
- finishes: Color variants with their own images

How sections show in the UI
- Specs, Applications, Features, Resources only show if they have items.
- Order on page: Specifications → Applications → Features → Resources.

Resources (downloads)
Use this format:
"resources": [
  { "label": "User Manual", "href": "rr226fost_UserManual_IT_EN.pdf" },
  { "label": "Product Drawing", "href": "radiofonografo_drawing.pdf" }
]

Gallery images
"gallery": [
  { "src": "radiofonografo_60_1.jpg", "alt": "Radiofonografo 60th — view 1" }
]

Lifestyle images
"lifestyle": [
  { "src": "radiofonografo_lifestyle_main.jpg", "alt": "Radiofonografo — lifestyle main", "caption": "A statement piece in the room." }
]

Finishes (color options)
"finishes": [
  {
    "key": "white",
    "name": "White",
    "hex": "#EDEDED",
    "order": 1,
    "image": "Radiofonografo_White_main.jpeg"
  }
]

Example (minimal product)
{
  "name": "Radiofonografo",
  "slug": "radiofonografo",
  "headline": "Radiofonografo",
  "series": "RR226 FO-ST",
  "description": "A sculptural console that glides beside a low sofa.",
  "image": "Radiofonografo_White_main.jpeg"
}

Example (full product)
{
  "name": "Radiocubo",
  "slug": "radiocubo",
  "headline": "Radiocubo",
  "series": "TS522D+",
  "description": "A compact cube radio that opens into a stereo-ready object.",
  "heroCopy": "A compact cube that opens into sound.",
  "story": "A small piece of architecture for everyday listening...",
  "image": "radio.cubo/Brionvega_Radiocubo-black_main.png",
  "specs": ["FM stereo", "Bluetooth"],
  "features": ["Iconic cube form", "Battery-powered"],
  "applications": ["Kitchen", "Bedroom"],
  "resources": [
    { "label": "User Manual", "href": "radiocubo50°_UserManual.pdf" }
  ],
  "gallery": [
    { "src": "radio.cubo/Brionvega_Radiocubo-black_main.png", "alt": "Radiocubo — Black" }
  ],
  "lifestyle": [
    { "src": "radio.cubo/Brionvega_Radiocubo_lifestyle1.jpg", "alt": "Radiocubo on a table", "caption": "Everyday listening." }
  ]
}

Tips
- Keep slugs unique across products.
- If a section is empty, delete it or leave it as an empty array [] (it won’t show).
- Filenames are case-sensitive. Use the exact name from the upload.
