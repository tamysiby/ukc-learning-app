# UKC Curriculum Roadmap & Learning Pathways

This document outlines the structured learning units, modules, and progression nodes planned for the UKC Learning App.

---

## 🗺️ Curriculum Overview

```mermaid
graph TD
    subgraph Level 1: Foundations
        U1L0[Lesson 0: Introduction to Hangul] --> U1L1[Lesson 1: Greetings & Manners]
        U1L1 --> U1L2[Lesson 2: Essential Daily Vocab]
        U1L2 --> U1L3[Lesson 3: School & Education]
        U1L3 --> U1Q[Unit 1 Master Quiz]
    end

    subgraph Level 2: Elementary
        U2L1[Lesson 1: Numbers & Counting] --> U2L2[Lesson 2: Food & Dining]
        U2L2 --> U2L3[Lesson 3: Ordering at a Cafe]
        U2L3 --> U2Q[Unit 2 Master Quiz]
    end

    subgraph Level 3: Intermediate
        U3L1[Lesson 1: Daily Routines & Tenses] --> U3L2[Lesson 2: Directions & Travel]
        U3L2 --> U3Q[Unit 3 Master Quiz]
    end

    U1Q --> U2L1
    U2Q --> U3L1
```

---

## 📌 Unit Breakdown

### Level 1: Korean Foundations

#### Unit 1: Essential Greetings & Core Vocabulary
- **Lesson 0**: Introduction to Hangul Reading (`les-u1-00`) - *Status: Documented (Ready for Build)*
- **Lesson 1**: Greetings & Manners (`les-u1-01`) - *Status: Documented & Implemented*
- **Lesson 2**: Essential Daily Vocabulary (`les-u1-02`) - *Status: Documented & Implemented*
- **Lesson 3**: School & Education Words (`les-u1-03`) - *Status: Documented (Ready for Build)*
- **Assessment**: Unit 1 Master Quiz (`quiz-u1`) - *Status: Documented (Ready for Build)*

#### Unit 2: Social Interactions & Culture
- **Lesson 1**: Introducing Yourself & Expressions (`les-u2-01`) - *Status: Planned*
- **Lesson 2**: Asking Questions (`les-u2-02`) - *Status: Planned*
- **Assessment**: Unit 2 Master Quiz (`quiz-u2`) - *Status: Planned*

---

## 📊 Node Progression Rules

1. **Sequential Unlock**: A student must complete preceding lessons before unlocking the next node.
2. **Mastery Threshold**: Unit Quizzes require a score of **80% or higher** to unlock the subsequent level.
3. **Streak Multiplier**: Daily logins maintain the user's active streak widget.
