# [LESSON SPECIFICATION TEMPLATE]

> **Status**: `[ DRAFT | UNDER REVIEW | APPROVED | IMPLEMENTED ]`  
> **Lesson ID**: `les-u[X]-[YY]`  
> **Unit**: `Unit [X]: [Unit Title]`  
> **Target Level**: `[ Beginner (Level 1) | Elementary (Level 2) | Intermediate (Level 3) ]`  
> **Estimated Duration**: `[ 10-15 mins ]`  
> **Author**: `[ Author Name / Curriculum Team ]`  

---

## 1. Overview & Learning Objectives

### 1.1 Summary
Provide a 2-3 sentence overview of what this lesson covers and its context within the unit.

### 1.2 Learning Objectives
By the end of this lesson, students will be able to:
- [ ] Objective 1 (e.g., Recognize and pronounce 5 key vocabulary words related to greetings).
- [ ] Objective 2 (e.g., Distinguish between formal and informal speech styles).
- [ ] Objective 3 (e.g., Complete a practice exercise with >= 80% accuracy).

---

## 2. Core Vocabulary & Flashcards

| Card ID | Korean (Hangul) | Romanization | English Translation | Category | Example Sentence | Example Translation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fc-1` | 안녕하세요 | An-nyeong-ha-se-yo | Hello / Good day (Formal) | Greetings | 안녕하세요! 만나서 반갑습니다. | Hello! Nice to meet you. |
| `fc-2` | ... | ... | ... | ... | ... | ... |

---

## 3. Grammar & Cultural Context Notes

### 3.1 Key Point 1: [Grammar Topic or Particle]
- **Explanation**: Detailed breakdown of how the rule works.
- **Formulation**: `[Noun] + [Particle]`
- **Examples**:
  - Example A: Korean -> English
  - Example B: Korean -> English

### 3.2 Cultural Context & Etiquette
- Explain any social norms, bowing etiquette, or honorific nuances associated with the lesson material.

---

## 4. Dialogue / Reading Practice (Optional)

**Speaker A**: 안녕하세요!  
**Speaker B**: 네, 안녕하세요!  
*Translation*:  
**Speaker A**: Hello!  
**Speaker B**: Yes, hello!

---

## 5. Interactive Component Specifications

- **Component Type**: `[ FlashcardDeck | FillInTheBlank | MultipleChoice | MatchingPairs | AudioListening ]`
- **Audio Prompts Required**: `[ Yes / No ]`
- **Completion Criteria**: `[ Review all cards | Score >= 80% | Complete matching ]`

---

## 6. Implementation JSON Schema

Copy-paste ready payload to be added to data fixtures or Supabase seed scripts:

```json
{
  "id": "les-uX-YY",
  "title": "[Lesson Title]",
  "unitId": "unit-X",
  "order": 1,
  "type": "vocab_flashcard",
  "flashcards": [
    {
      "id": "fc-1",
      "korean": "Word",
      "romanization": "Romanization",
      "english": "English",
      "category": "Category",
      "audioUrl": "",
      "exampleSentence": "Sentence",
      "exampleTranslation": "Translation"
    }
  ]
}
```
