# [UNIT QUIZ SPECIFICATION TEMPLATE]

> **Status**: `[ DRAFT | UNDER REVIEW | APPROVED | IMPLEMENTED ]`  
> **Quiz ID**: `quiz-u[X]`  
> **Unit**: `Unit [X]: [Unit Title]`  
> **Passing Score**: `80%`  
> **Time Limit**: `10 minutes (Optional)`  

---

## 1. Quiz Structure & Weighting

| Question # | Question Type | Primary Skill Tested | Points |
| :--- | :--- | :--- | :--- |
| 1 | Multiple Choice | Vocabulary Recognition | 20 |
| 2 | Audio Listening | Pronunciation / Listening | 20 |
| 3 | Matching Pairs | Word-Meaning Association | 20 |
| 4 | Fill-in-the-Blank | Grammar / Sentence Structure | 20 |
| 5 | Translation | Contextual Understanding | 20 |

---

## 2. Questions & Answer Key

### Question 1: Multiple Choice
- **Prompt**: What is the formal Korean phrase for "Thank you"?
- **Options**:
  - A) 안녕하세요 (An-nyeong-ha-se-yo)
  - B) 감사합니다 (Gam-sa-ham-ni-da) *(Correct)*
  - C) 학교 (Hak-gyo)
  - D) 학생 (Hak-saeng)
- **Explanation**: 감사합니다 is derived from "감사" (gratitude) and "합니다" (to do in formal high speech).

### Question 2: Fill-in-the-Blank
- **Prompt**: Complete the sentence: "저는 아침 일찍 _____에 갑니다." (I go to school early in the morning.)
- **Answer**: `학교`
- **Acceptable Hints**: `Hak-gyo / School`

---

## 3. Quiz Data Schema JSON

```json
{
  "quizId": "quiz-u1",
  "unitId": "unit-1",
  "title": "Unit 1 Master Quiz",
  "passingScore": 80,
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "prompt": "What is the formal Korean phrase for 'Thank you'?",
      "options": ["안녕하세요", "감사합니다", "학교", "학생"],
      "correctIndex": 1,
      "explanation": "감사합니다 is the standard formal phrase for 'Thank you'."
    }
  ]
}
```
