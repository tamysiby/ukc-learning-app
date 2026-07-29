---
name: add-lesson
description: Add a new Korean vocabulary or grammar lesson to the database given raw user input. Automatically formats schema, generates romanizations, sanitizes translations/typos, assigns order_index as the very last lesson, and syncs Supabase DB, schema.sql, and default reference files.
---

# Add Lesson Skill (`add-lesson`)

This skill defines the step-by-step workflow for ingesting raw lesson notes from a prompt, cleaning up typos, generating missing fields, appending the lesson to the end of the pathway, and persisting changes across Supabase and workspace reference files.

---

## 📌 Workflow Steps

### 1. Ingest & Sanitize Input
1. **Title & Type**: Extract lesson title (e.g. `Classroom Vocab (교실용어)`) and type (`custom` or `vocab`).
2. **Korean Typo & Spacing Fixes**: Fix common Korean spacing errors (e.g. `물어 보세요` $\rightarrow$ `물어보세요`).
3. **Romanization Generation (Rule #10 Resyllabification)**:
   - Apply official Revised Romanization of Korean (연음 법칙: carry batchim to next vowel syllable).
   - Examples: `들으세요` $\rightarrow$ `deu-reu-se-yo` (NOT `deul-eu-se-yo`), `읽으세요` $\rightarrow$ `il-geu-se-yo` (NOT `ilg-eu-se-yo`), `물어보세요` $\rightarrow$ `mu-reo-bo-se-yo`.
4. **English Translation Casing (Rule #7 Compliance)**:
   - Format `english` translations in **all lowercase** (e.g., `please look`, `listen and repeat`, `do you understand?`).
   - Exception: Capitalize proper nouns (e.g., `how do you say it in Korean?`).
5. **Categorization & Item IDs**:
   - Assign clean IDs (`cr-1`, `cr-2`, etc. or prefixed for the lesson).
   - Group items into intuitive categories (`Commands`, `Questions`, `Answers`, `Expressions`, `Feedback`, `Vocab`).

### 2. Determine Order Index (Live DB Check: Biggest `order_index` + 1)
1. **Query Live Supabase DB**: Query table `public.lessons` for all `order_index` values.
2. **Calculate Next Order Index**: Find the maximum `order_index` currently in the database (`maxOrder`) and assign `order_index = maxOrder + 1` for the new lesson.
3. **Helper Script Auto-Assignment**: `add_lesson_to_db.js` automatically inspects `public.lessons` in Supabase DB and assigns `maxOrder + 1` whenever a new lesson is added.

### 3. Database & Workspace Synchronization
1. **Live Supabase Upsert**: Run the helper script [add_lesson_to_db.js](file:///home/tamy/p/ukc-learning-app/.agents/skills/add-lesson/scripts/add_lesson_to_db.js) or execute Supabase client upsert to add the record to table `public.lessons`.
2. **Assign to Active Users**: Ensure student accounts in `public.users` get the new lesson ID appended to their `assigned_lesson_ids`.
3. **Schema Seed Update**: Append the new lesson INSERT statement to [`supabase/schema.sql`](file:///home/tamy/p/ukc-learning-app/supabase/schema.sql).
4. **Reference Documentation**: Append the JSON lesson object to [`docs/default_lessons_reference.md`](file:///home/tamy/p/ukc-learning-app/docs/default_lessons_reference.md).
5. **User Session Store Defaults**: Add the new lesson ID to `defaultAssigned` arrays in [`src/services/userSessionStore.js`](file:///home/tamy/p/ukc-learning-app/src/services/userSessionStore.js).

### 4. Verification
- Run `npx vitest run` to ensure lesson registry and pathway navigation tests pass without regressions.
