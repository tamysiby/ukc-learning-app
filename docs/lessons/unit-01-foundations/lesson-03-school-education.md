# Lesson Specification: School & Education Words

> **Status**: `READY FOR BUILD`  
> **Lesson ID**: `les-u1-03`  
> **Unit**: `Unit 1: Korean Foundations`  
> **Target Level**: `Beginner (Level 1)`  
> **Estimated Duration**: `15 mins`  

---

## 1. Learning Objectives
- Identify key classroom items and academic terminology.
- Use location particles `에` (to/at) and `에서` (in/at location of action).
- Form simple sentences expressing studying or reading at school.

---

## 2. Vocabulary & Flashcard Specs

| Card ID | Korean | Romanization | English | Category | Example Sentence | Example Translation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fc-se1` | 책상 | Chaek-sang | Desk | Classroom | 책상 위에 책이 있습니다. | There is a book on the desk. |
| `fc-se2` | 의자 | Ui-ja | Chair | Classroom | 의자에 앉으세요. | Please sit on the chair. |
| `fc-se3` | 연필 | Yeon-pil | Pencil | Supplies | 연필로 글씨를 씁니다. | I write with a pencil. |
| `fc-se4` | 교실 | Gyo-sil | Classroom | Campus | 학생들이 교실에 있습니다. | Students are in the classroom. |
| `fc-se5` | 공부하다 | Gong-bu-ha-da | To study | Verbs | 도서관에서 공부합니다. | I study in the library. |

---

## 3. Grammar Notes

### Particle: `에` vs `에서`
- **`에` (Location of static existence or destination)**: Used with `있다` (to exist), `없다` (to not exist), `가다` (to go).
  - Example: `교실에 갑니다.` (I go to the classroom.)
- **`에서` (Location of dynamic action)**: Used when an activity or verb takes place in that location.
  - Example: `교실에서 공부합니다.` (I study in the classroom.)

---

## 4. Implementation JSON Data

```json
{
  "id": "les-u1-03",
  "title": "School & Education Words",
  "unitId": "unit-1",
  "order": 3,
  "type": "vocab_flashcard",
  "status": "ready_for_build",
  "flashcards": [
    {
      "id": "fc-se1",
      "korean": "책상",
      "romanization": "Chaek-sang",
      "english": "Desk",
      "category": "Classroom",
      "exampleSentence": "책상 위에 책이 있습니다.",
      "exampleTranslation": "There is a book on the desk."
    },
    {
      "id": "fc-se2",
      "korean": "의자",
      "romanization": "Ui-ja",
      "english": "Chair",
      "category": "Classroom",
      "exampleSentence": "의자에 앉으세요.",
      "exampleTranslation": "Please sit on the chair."
    },
    {
      "id": "fc-se3",
      "korean": "연필",
      "romanization": "Yeon-pil",
      "english": "Pencil",
      "category": "Supplies",
      "exampleSentence": "연필로 글씨를 씁니다.",
      "exampleTranslation": "I write with a pencil."
    },
    {
      "id": "fc-se4",
      "korean": "교실",
      "romanization": "Gyo-sil",
      "english": "Classroom",
      "category": "Campus",
      "exampleSentence": "학생들이 교실에 있습니다.",
      "exampleTranslation": "Students are in the classroom."
    },
    {
      "id": "fc-se5",
      "korean": "공부하다",
      "romanization": "Gong-bu-ha-da",
      "english": "To study",
      "category": "Verbs",
      "exampleSentence": "도서관에서 공부합니다.",
      "exampleTranslation": "I study in the library."
    }
  ]
}
```
