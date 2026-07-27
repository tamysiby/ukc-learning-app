# Project Guidelines & Design Preferences

## UI/UX & Layout Preferences

1. **Ultra-Minimalist & Noise-Free Interface**:
   - Keep screens clean and uncluttered. Avoid unnecessary decorative badges, repetitive card headers, or redundant subtitle text.
   - Omit explanatory subtitles when the main heading or interactive element already makes the context obvious (e.g., state titles like `"Lesson Passed!"` or `"Out of Hearts!"` don't need additional paragraph descriptions).

2. **Concise Micro-Copy & Labels**:
   - Use short, direct text for buttons and badges (e.g., `"Exit"` instead of `"Exit to Pathway"`, `"Completed"` instead of `"Completed • 100% ✓"`).
   - Avoid emojis in badge/button labels unless explicitly requested (e.g., use `"Current Lesson ▶"` over emoji badges).

3. **Focused Component Hierarchy**:
   - Focus directly on interactive content (e.g., character cards, matching columns, keypad) rather than surrounding wrapper badges like question category labels (`"matching"`, `"Q1"`, `"promptText"`).
   - In Flashcard view, omit front-side romanization badges, remove `"Listen Pronunciation"` text labels (icon-only `volume_up`), and remove `"English Translation & Meaning"` section headers.

4. **Flashcard Navigation over Gamification**:
   - Prefer clean Previous/Next (Forward/Backward) arrow navigation over Hard/Easy rating systems or scoring buttons on flashcards.

5. **Admin Portal Batch Controls & Clean Modals**:
   - Provide batch actions like `"Select All" / "Deselect All"` in student access assignment modals.
   - Keep modal headers concise (single title line like `"Configure Student Lessons"`) without restoring deleted subheadings.

6. **Visual Status Indicators over Text Counters**:
   - Use smooth visual progress bars instead of text counters (e.g., progress bar instead of `"1 / 10"` text).
   - Use visual heart indicators (`❤️❤️❤️`) for quiz life tracking.

7. **Vocabulary English Translation Casing**:
   - When creating or updating vocabulary items in lessons (`words`), the `english` translation field MUST be **all lowercase** (e.g., `"seesaw"`, `"lion"`, `"bird"`, `"clock"`, `"it's hot"`), UNLESS it is a proper noun (e.g., `"Korea"`, `"Seoul"`).

8. **Minimal English in Lessons**:
   - When creating or updating lessons, stick to as little English explanation as possible. The target audience may not be fluent in English.
   - Keep lessons intuitive using visual graphics, clean simple Korean, or minimal English only when strictly necessary.
