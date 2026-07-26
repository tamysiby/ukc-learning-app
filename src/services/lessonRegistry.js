/**
 * Lesson Registry Service
 * Central registry and data access layer for all curriculum lessons, pathway state, and student completion logic.
 */

const STORAGE_LESSONS_KEY = 'ukc_learning_lessons_db';

export const DEFAULT_LESSONS = [
  {
    id: 'les-vowels-1',
    order: 1,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '한글 모음',
    description: 'Learn fundamental Korean vowel characters and sound pronunciations.',
    type: 'vocab',
    pairedQuizId: 'les-vowels-quiz-1',
    status: 'Active',
    words: [
      { id: 'v-1', korean: 'ㅏ', romanization: 'a', english: 'a', category: 'Vowels' },
      { id: 'v-2', korean: 'ㅓ', romanization: 'eo', english: 'eo', category: 'Vowels' },
      { id: 'v-3', korean: 'ㅗ', romanization: 'o', english: 'o', category: 'Vowels' },
      { id: 'v-4', korean: 'ㅜ', romanization: 'u', english: 'u', category: 'Vowels' },
      { id: 'v-5', korean: 'ㅡ', romanization: 'eu', english: 'eu', category: 'Vowels' },
      { id: 'v-6', korean: 'ㅣ', romanization: 'i', english: 'i', category: 'Vowels' },
      { id: 'v-7', korean: 'ㅔ', romanization: 'e', english: 'e', category: 'Vowels' },
      { id: 'v-8', korean: 'ㅐ', romanization: 'ae', english: 'ae', category: 'Vowels' },
      { id: 'v-9', korean: 'ㅑ', romanization: 'ya', english: 'ya', category: 'Vowels' },
      { id: 'v-10', korean: 'ㅕ', romanization: 'yeo', english: 'yeo', category: 'Vowels' },
      { id: 'v-11', korean: 'ㅛ', romanization: 'yo', english: 'yo', category: 'Vowels' },
      { id: 'v-12', korean: 'ㅠ', romanization: 'yu', english: 'yu', category: 'Vowels' },
      { id: 'v-13', korean: 'ㅖ', romanization: 'ye', english: 'ye', category: 'Vowels' },
      { id: 'v-14', korean: 'ㅒ', romanization: 'yae', english: 'yae', category: 'Vowels' },
      { id: 'v-15', korean: 'ㅘ', romanization: 'wa', english: 'wa', category: 'Vowels' },
      { id: 'v-16', korean: 'ㅝ', romanization: 'wo', english: 'wo', category: 'Vowels' },
      { id: 'v-17', korean: 'ㅟ', romanization: 'wi', english: 'wi', category: 'Vowels' },
      { id: 'v-18', korean: 'ㅚ', romanization: 'oe', english: 'oe', category: 'Vowels' },
      { id: 'v-19', korean: 'ㅞ', romanization: 'we', english: 'we', category: 'Vowels' },
      { id: 'v-20', korean: 'ㅙ', romanization: 'wae', english: 'wae', category: 'Vowels' },
      { id: 'v-21', korean: 'ㅢ', romanization: 'ui', english: 'ui', category: 'Vowels' }
    ]
  },
  {
    id: 'les-vowels-quiz-1',
    order: 2,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '한글 모음 퀴즈',
    description: 'Test your knowledge on Korean vowels and vocabulary.',
    type: 'vocab quiz',
    pairedVocabId: 'les-vowels-1',
    status: 'Active'
  },
  {
    id: 'les-consonants-1',
    order: 3,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '한글 자음',
    description: 'Learn basic Korean consonants and consonant vocabulary.',
    type: 'vocab',
    pairedQuizId: 'les-consonants-quiz-1',
    status: 'Active',
    words: [
      { id: 'c-1', korean: 'ㄱ', romanization: 'g', english: 'g', category: 'Consonants' },
      { id: 'c-2', korean: 'ㄴ', romanization: 'n', english: 'n', category: 'Consonants' },
      { id: 'c-3', korean: 'ㄷ', romanization: 'd', english: 'd', category: 'Consonants' },
      { id: 'c-4', korean: 'ㄹ', romanization: 'r', english: 'r', category: 'Consonants' },
      { id: 'c-5', korean: 'ㅁ', romanization: 'm', english: 'm', category: 'Consonants' },
      { id: 'c-6', korean: 'ㅂ', romanization: 'b', english: 'b', category: 'Consonants' },
      { id: 'c-7', korean: 'ㅅ', romanization: 's', english: 's', category: 'Consonants' },
      { id: 'c-8', korean: 'ㅇ', romanization: 'ng', english: 'ng', category: 'Consonants' },
      { id: 'c-9', korean: 'ㅈ', romanization: 'j', english: 'jt', category: 'Consonants' },
      { id: 'c-10', korean: 'ㅊ', romanization: 'ch', english: 'ch', category: 'Consonants' },
      { id: 'c-11', korean: 'ㅋ', romanization: 'k', english: 'k', category: 'Consonants' },
      { id: 'c-12', korean: 'ㅌ', romanization: 't', english: 't', category: 'Consonants' },
      { id: 'c-13', korean: 'ㅍ', romanization: 'p', english: 'p', category: 'Consonants' },
      { id: 'c-14', korean: 'ㅎ', romanization: 'h', english: 'h', category: 'Consonants' },
      { id: 'c-15', korean: 'ㅃ', romanization: 'pp', english: 'pp', category: 'Consonants' },
      { id: 'c-16', korean: 'ㄸ', romanization: 'tt', english: 'tt', category: 'Consonants' },
      { id: 'c-17', korean: 'ㄲ', romanization: 'kk', english: 'kk', category: 'Consonants' },
      { id: 'c-18', korean: 'ㅆ', romanization: 'ss', english: 'ss', category: 'Consonants' },
      { id: 'c-19', korean: 'ㅉ', romanization: 'jj', english: 'jj', category: 'Consonants' },
    ]
  },
  {
    id: 'les-consonants-quiz-1',
    order: 4,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '한글 자음 퀴즈',
    description: 'Test your knowledge on Korean consonants and vocabulary.',
    type: 'vocab quiz',
    pairedVocabId: 'les-consonants-1',
    status: 'Active'
  },
];

export function getStoredLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_LESSONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean stored lessons to ensure master words list and quiz pairings stay aligned
      const updated = parsed.map(l => {
        if (l.id === 'les-vowels-1') {
          return { ...l, words: DEFAULT_LESSONS[0].words };
        }
        if (l.type === 'vocab quiz') {
          const { words, ...quizLessonWithoutWords } = l;
          return quizLessonWithoutWords;
        }
        return l;
      });
      return updated;
    }
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
 * Calculates dynamic pathway nodes for a student:
 * 1. Only assigned lessons are displayed.
 * 2. Vocab lessons complete upon opening and are non-blocking.
 * 3. Vocab Quiz lessons block subsequent lessons if incomplete. Completing a quiz auto-completes its paired vocab.
 */
export function getStudentPathwayNodes(
  assignedLessonIds = ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1'],
  completedLessonIds = []
) {
  const allLessons = getStoredLessons();
  const sortedLessons = [...allLessons].sort((a, b) => a.order - b.order);

  // Filter only assigned lessons
  const assignedLessons = sortedLessons.filter(l => assignedLessonIds.includes(l.id));

  // Determine locking state based on vocab quiz completion
  let allPrecedingQuizzesCompleted = true;

  return assignedLessons.map((lesson) => {
    const isCompleted = completedLessonIds.includes(lesson.id);

    let nodeStatus = 'locked';

    if (isCompleted) {
      nodeStatus = 'completed';
    } else if (allPrecedingQuizzesCompleted) {
      nodeStatus = 'active';
    } else {
      nodeStatus = 'locked';
    }

    // If this lesson is a vocab quiz and it is NOT completed, subsequent lessons will be locked
    if (lesson.type === 'vocab quiz' && !isCompleted) {
      allPrecedingQuizzesCompleted = false;
    }

    return {
      ...lesson,
      nodeStatus
    };
  });
}
