---
name: generate-illust
description: Generate educational app illustrations with a minimalist, friendly, colorful, flat design aesthetic.
---

# Generate Illustration Skill

Use this skill whenever generating pictures, illustrations, visual assets, or flashcard images for the educational app.

## Prompt Style Template
When calling the `generate_image` tool, format the `Prompt` using the project's standard aesthetic style:

> "A minimalist, friendly, and colorful illustration of [SUBJECT]. Clean lines, simple shapes, flat design style. Professional educational app style. Generate with as minimal elements as possible with clean backgrounds as long as the picture clearly indicates [SUBJECT]. No extra illustration like face or other irrelevant elements unless necessary."

## Implementation Instructions
1. **Determine the Subject**: Identify the specific object, word, or scene to illustrate (e.g., "apple", "seesaw", "tree", "clock").
2. **Formulate Prompt**: Combine the subject with the base style string:
   `"A minimalist, friendly, and colorful illustration of [SUBJECT]. Clean lines, simple shapes, flat design style. Professional educational app style. Generate with as minimal elements as possible with clean backgrounds as long as the picture clearly indicates [SUBJECT]. No extra illustration like face or other irrelevant elements unless necessary."`
3. **Execute Tool**: Invoke `generate_image`:
   - `ImageName`: Descriptive lowercase snake_case name (e.g. `illust_apple`, `illust_seesaw`).
   - `Prompt`: The complete formatted prompt text.
