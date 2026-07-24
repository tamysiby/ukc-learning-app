# Quiz Specification: Unit 1 Final Master Quiz

> **Status**: `READY FOR BUILD`  
> **Quiz ID**: `quiz-u1`  
> **Unit**: `Unit 1: Korean Foundations`  
> **Passing Score**: `80% (4 out of 5 correct)`  
> **Reward**: `Unit Completion Badge + 100 XP`  

---

## 1. Overview
The Unit 1 Master Quiz evaluates students across all 3 lessons (Greetings, Essential Vocab, and School Words) before unlocking Level 2.

---

## 2. Assessment Questions

### Question 1 (Multiple Choice)
- **Prompt**: What is the correct formal response when someone says "도와주셔서 _____." (Thank you for helping me.)?
- **Options**:
  - A) 감사합니다 (Gam-sa-ham-ni-da) *(Correct)*
  - B) 학교 (Hak-gyo)
  - C) 교실 (Gyo-sil)
  - D) 의자 (Ui-ja)

### Question 2 (Vocabulary Matching)
- **Prompt**: Match the Hangul word `선생님` to its English translation:
  - Options: A) Student | B) Teacher *(Correct)* | C) Pencil | D) Desk

### Question 3 (Grammar Fill-in)
- **Prompt**: Select the correct phrase: "저는 _____에 갑니다." (I go to school.)
- **Options**:
  - A) 학교 (Hak-gyo) *(Correct)*
  - B) 안녕하세요 (An-nyeong-ha-se-yo)
  - C) 반갑습니다 (Ban-gap-sam-ni-da)
  - D) 연필 (Yeon-pil)

### Question 4 (Etiquette Distinction)
- **Prompt**: Which phrase should you say when YOU are leaving a party, but the host is staying at home?
- **Options**:
  - A) 안녕히 계세요 (An-nyeong-hi gye-se-yo) *(Correct)*
  - B) 안녕히 가세요 (An-nyeong-hi ga-se-yo)
  - C) 감사합니다 (Gam-sa-ham-ni-da)
  - D) 공부하다 (Gong-bu-ha-da)

### Question 5 (Action Verb & Location)
- **Prompt**: Complete the sentence: "도서관에서 _____." (I study in the library.)
- **Options**:
  - A) 공부합니다 (Gong-bu-ham-ni-da) *(Correct)*
  - B) 선생님 (Seon-saeng-nim)
  - C) 학생 (Hak-saeng)
  - D) 책상 (Chaek-sang)

---

## 3. Implementation JSON Schema

```json
{
  "quizId": "quiz-u1",
  "unitId": "unit-1",
  "title": "Unit 1 Final Master Quiz",
  "passingScore": 80,
  "questions": [
    {
      "id": "u1-q1",
      "type": "multiple_choice",
      "prompt": "What is the correct formal phrase for 'Thank you'?",
      "options": ["감사합니다", "학교", "교실", "의자"],
      "correctIndex": 0,
      "explanation": "감사합니다 is the standard formal phrase for expressing gratitude."
    },
    {
      "id": "u1-q2",
      "type": "multiple_choice",
      "prompt": "What is the English meaning of '선생님'?",
      "options": ["Student", "Teacher", "Pencil", "Desk"],
      "correctIndex": 1,
      "explanation": "선생님 means Teacher or Instructor."
    },
    {
      "id": "u1-q3",
      "type": "multiple_choice",
      "prompt": "Complete: '저는 _____에 갑니다.' (I go to school.)",
      "options": ["학교", "안녕하세요", "반갑습니다", "연필"],
      "correctIndex": 0,
      "explanation": "학교 means School."
    },
    {
      "id": "u1-q4",
      "type": "multiple_choice",
      "prompt": "Which phrase do you use when YOU leave while the host stays?",
      "options": ["안녕히 계세요", "안녕히 가세요", "감사합니다", "공부하다"],
      "correctIndex": 0,
      "explanation": "안녕히 계세요 means 'Stay in peace'."
    },
    {
      "id": "u1-q5",
      "type": "multiple_choice",
      "prompt": "Complete: '도서관에서 _____.' (I study in the library.)",
      "options": ["공부합니다", "선생님", "학생", "책상"],
      "correctIndex": 0,
      "explanation": "공부합니다 means 'I study'."
    }
  ]
}
```
