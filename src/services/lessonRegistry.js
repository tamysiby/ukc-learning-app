// Lesson Registry & Student Pathway Calculator

const STORAGE_LESSONS_KEY = 'ukc_app_lessons_db_v1';

export const DEFAULT_LESSONS = [
  {
    id: 'les-hangul-1',
    order: 1,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: 'Lesson 1: Introduction to Hangul (한글)',
    description: 'Learn each consonant & vowel character and master how an 음절 (syllable block) is formed with interactive builder.',
    type: 'hangul',
    status: 'Active'
  },
  {
    id: 'les-vocab-1',
    order: 2,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: 'Lesson 2: Essential Vocabulary Flashcards',
    description: 'Practice 5 essential daily phrases with audio & 3D interactive flip deck.',
    type: 'vocab',
    status: 'Active'
  },
  {
    id: 'les-greetings-2',
    order: 3,
    unit: 'Unit 2: Greetings & Daily Expressions',
    title: 'Lesson 3: Daily Expressions & Greetings',
    description: 'Master formal and informal Korean greeting phrases and social etiquette.',
    type: 'vocab',
    status: 'Active'
  },
  {
    id: 'les-grammar-3',
    order: 4,
    unit: 'Unit 2: Greetings & Daily Expressions',
    title: 'Lesson 4: Basic Korean Grammar & SOV Structure',
    description: 'Learn Subject-Object-Verb (SOV) sentence order and topic markers 은/는.',
    type: 'quiz',
    status: 'Active'
  }
];

export function getStoredLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_LESSONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading lessons database:', e);
  }
  saveStoredLessons(DEFAULT_LESSONS);
  return DEFAULT_LESSONS;
}

export function saveStoredLessons(lessons) {
  try {
    localStorage.setItem(STORAGE_LESSONS_KEY, JSON.stringify(lessons));
  } catch (e) {
    console.error('Error saving lessons database:', e);
  }
}

/**
 * Calculates the dynamic pathway nodes for a student based on two rules:
 * 1. Unassigned lessons are NOT displayed (completely hidden).
 * 2. Assigned lessons are displayed. If previous assigned lesson is incomplete, status is 'locked'.
 */
export function getStudentPathwayNodes(assignedLessonIds = ['les-hangul-1', 'les-vocab-1'], completedLessonIds = []) {
  const allLessons = getStoredLessons();
  const sortedLessons = [...allLessons].sort((a, b) => a.order - b.order);

  // 1. Filter only assigned lessons
  const assignedLessons = sortedLessons.filter(l => assignedLessonIds.includes(l.id));

  // 2. Compute status for each assigned lesson
  let isPreviousCompleted = true; // First assigned lesson is unlocked by default

  return assignedLessons.map((lesson) => {
    const isCompleted = completedLessonIds.includes(lesson.id);
    let nodeStatus = 'locked';

    if (isCompleted) {
      nodeStatus = 'completed';
      isPreviousCompleted = true;
    } else if (isPreviousCompleted) {
      nodeStatus = 'active';
      isPreviousCompleted = false; // Next assigned lesson will be locked until this one completes
    } else {
      nodeStatus = 'locked';
    }

    return {
      ...lesson,
      nodeStatus
    };
  });
}
