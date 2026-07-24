# Content Style & Pedagogical Guide

This guide establishes language standards, audio requirements, and formatting guidelines for all Korean learning materials prepared for the UKC Learning App.

---

## 1. Korean Language & Orthography Standards

### 1.1 Standard Korean (표준어)
- All vocabulary and dialogues must adhere to standard Seoul/Gyeonggi Korean orthography as defined by the **National Institute of Korean Language (국립국어원)**.
- Avoid dialectal variants unless explicitly teaching regional nuances in advanced units.

### 1.2 Formality Levels & Speech Styles
Each lesson spec must indicate the formality level of example sentences:
- **존댓말 (Formal High / Haepsio-che - 하십시오체)**: Used in public broadcasts, business, official presentations (e.g., `감사합니다`, `입니까?`).
- **해요체 (Informal High / Polite Politeness)**: Used for daily interactions with elders, colleagues, and acquaintances (e.g., `안녕하세요`, `고마워요`).
- **반말 (Informal Low / Casual)**: Used among close friends of same/younger age. Only introduced in designated social interaction modules.

---

## 2. Revised Romanization Guidelines

To ensure readability for international learners, follow the **Revised Romanization of Korean (2000 standard)** with hyphens between syllable blocks when helpful for pronunciation:

| Hangul | Recommended Romanization | Example |
| :--- | :--- | :--- |
| **안녕하세요** | `An-nyeong-ha-se-yo` | Syllable-hyphenated for clarity |
| **감사합니다** | `Gam-sa-ham-ni-da` | Sound change reflected (ㅂ -> ㅁ) |
| **학교** | `Hak-gyo` | Unvoiced to voiced consonant rule |
| **학생** | `Hak-saeng` | Compound noun hyphenation |
| **선생님** | `Seon-saeng-nim` | Clear syllable division |

---

## 3. Audio & Voice Guidelines

- **Synthesizer Fallback**: Web Speech API (`ko-KR`) is used as fallback. Synthesized text must contain proper punctuation to enforce correct intonation.
- **Human Audio Assets**:
  - Format: MP3 / WebM
  - Sample Rate: 44.1 kHz, 16-bit Mono
  - Loudness Normalization: -16 LUFS
  - File Naming: `audio_<lesson_id>_<vocab_id>.mp3` (e.g. `audio_u1_l02_fc1.mp3`)

---

## 4. Lesson Content Structure Guidelines

Every lesson specification must include:
1. **Target Learning Outcomes**: 2-3 measurable goals (e.g., "Learner can express gratitude in formal contexts").
2. **Vocabulary Table**: Korean, Romanization, English, Category, Audio key, and Contextual Example.
3. **Grammar & Culture Notes**: Breakdown of particle usage, verb stem inflections, or cultural etiquette.
4. **Practice & Flashcard Deck**: Interactive card sequence with self-assessment ratings (`Easy` vs `Hard`).
5. **Assessment / Quiz Items**: 3-5 check-for-understanding questions.
