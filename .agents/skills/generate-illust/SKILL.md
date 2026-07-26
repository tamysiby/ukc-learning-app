---
name: generate-illust
description: Generate educational app illustrations with a minimalist, friendly, colorful, flat SVG design aesthetic given a lesson ID or vocabulary item.
---

# Generate Illustration Skill

Use this skill whenever generating pictures, illustrations, visual assets, or vector SVGs for vocabulary lessons in the educational app given a lesson ID (e.g., `les-vocab-practice-1`, `les-vocab-practice-2`).

## Design Preferences & Aesthetics
1. **SVG Vector Format**: Always output pure, lightweight XML SVG files using `viewBox="0 0 100 100"` (or standard square viewBox).
2. **Flat & Modern Graphic Style**: Minimalist, friendly, educational vector design with clean geometric shapes (`<circle>`, `<rect>`, `<path>`, `<polygon>`).
3. **Color Palette**: Use vibrant, curated modern color tokens:
   - Red/Coral: `#EF4444`, `#F43F5E`, `#EA596E`
   - Orange/Amber: `#F97316`, `#F59E0B`, `#D97706`
   - Emerald/Green: `#10B981`, `#22C55E`, `#047857`
   - Cyan/Blue: `#06B6D4`, `#3B82F6`, `#1D4ED8`, `#38BDF8`
   - Purple/Pink: `#8B5CF6`, `#EC4899`, `#F472B6`
   - Dark/Slate Outlines: `#1E293B`, `#0F172A`
   - Clean Highlights: `#F8FAFC`, `#FEF08A`
4. **Strokes & Radii**: Use smooth rounded stroke caps (`stroke-linecap="round"`), clean joins (`stroke-linejoin="round"`), and soft corner radii (`rx="..."`).
5. **No Noise / Distractions**: Keep backgrounds clean. Focus on a clear, recognizable representation of the subject without unnecessary text labels or visual clutter.
6. **File Location**: Save SVG illustrations to `/public/illustrations/{vocabId}.svg` (e.g., `public/illustrations/vp2-1.svg`).

## Workflow for a Given Lesson ID:
1. **Fetch Lesson Words**: Locate the target lesson in `src/services/lessonRegistry.js` using its `id` (e.g., `les-vocab-practice-2`).
2. **Extract Word IDs**: Iterate through the lesson's `words` array (e.g., `vp2-1` -> bag, `vp2-2` -> classroom, etc.).
3. **Generate SVG Files**: For each word, create `/public/illustrations/{id}.svg` following the design preferences above.
4. **Register IDs**: Add the new illustration IDs to `hasVocabIllustration()` inside `src/components/VocabIllustration.jsx`.
