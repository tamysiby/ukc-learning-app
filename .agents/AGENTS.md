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

9. **Grammar Lesson UI & Layout Consistency**:
   - All grammar and syntax lessons MUST follow the standard component structure established in [`EyoLesson.jsx`](file:///home/tamy/p/ukc-learning-app/src/lessons/eyo/EyoLesson.jsx) (documented in [`grammar-lesson-guidelines.md`](file:///home/tamy/p/ukc-learning-app/docs/guidelines/grammar-lesson-guidelines.md)).
   - **Sticky Top Bar**: `sticky top-0 z-40` with close button, pattern title, and Mode Switcher Pill (`Casual` | `Polite` | `Formal` with `Polite` active on mount).
   - **Visual Equation Cards**: High contrast math equation cards (`[Noun] + [Ending] = [Result]`) using `bg-primary/10` for `받침 O` and `bg-emerald-500/10` for `받침 X`.
   - **2-Column Example Grid**: Clean cards with `w-24 h-24` illustration container, batchim status pill, and icon-only TTS audio buttons for `Q:` bubble (`bg-surface-container-low`) and `A:` bubble (`bg-primary-fixed/30`).

10. **Korean Phonological Romanization & Resyllabification (연음 법칙)**:
    - Follow the official Revised Romanization of Korean (국어의 로마자 표기법). When a final consonant (받침) is followed by a syllable starting with a vowel (`ㅇ`), romanize according to its resyllabified pronunciation.
    - Examples:
      - `들으세요` $\rightarrow$ `deu-reu-se-yo` (NOT `deul-eu-se-yo`)
      - `읽으세요` $\rightarrow$ `il-geu-se-yo` (NOT `ilg-eu-se-yo`)
      - `물어보세요` $\rightarrow$ `mu-reo-bo-se-yo` (NOT `mul-eo-bo-se-yo`)
      - `할아버지` $\rightarrow$ `ha-ra-beo-ji` (NOT `hal-a-beo-ji`)
