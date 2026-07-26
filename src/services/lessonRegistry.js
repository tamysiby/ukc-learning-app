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
      { id: 'c-19', korean: 'ㅉ', romanization: 'jj', english: 'jj', category: 'Consonants' }
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
  {
    id: 'les-vocab-practice-1',
    order: 5,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '단어연습 1',
    description: 'Essential Korean vocabulary reading practice (No 받침).',
    type: 'vocab',
    pairedQuizId: 'les-vocab-practice-quiz-1',
    status: 'Active',
    words: [
      { id: 'vp1-2', korean: '사자', romanization: 'sa-ja', english: 'lion', category: 'Vocab' },
      { id: 'vp1-3', korean: '새', romanization: 'sae', english: 'bird', category: 'Vocab' },
      { id: 'vp1-4', korean: '뼈', romanization: 'ppyeo', english: 'bone', category: 'Vocab' },
      { id: 'vp1-5', korean: '시계', romanization: 'si-gye', english: 'clock', category: 'Vocab' },
      { id: 'vp1-6', korean: '소주', romanization: 'so-ju', english: 'soju', category: 'Vocab' },
      { id: 'vp1-7', korean: '쏘다', romanization: 'sso-da', english: 'shoot', category: 'Vocab' },
      { id: 'vp1-9', korean: '싸다', romanization: 'ssa-da', english: 'cheap', category: 'Vocab' },
      { id: 'vp1-10', korean: '바지', romanization: 'ba-ji', english: 'pants', category: 'Vocab' },
      { id: 'vp1-11', korean: '피자', romanization: 'pi-ja', english: 'pizza', category: 'Vocab' },
      { id: 'vp1-12', korean: '고추', romanization: 'go-chu', english: 'chili pepper', category: 'Vocab' },
      { id: 'vp1-13', korean: '치즈', romanization: 'chi-jeu', english: 'cheese', category: 'Vocab' },
      { id: 'vp1-14', korean: '휴지', romanization: 'hyu-ji', english: 'tissue', category: 'Vocab' },
      { id: 'vp1-15', korean: '호수', romanization: 'ho-su', english: 'lake', category: 'Vocab' },
      { id: 'vp1-16', korean: '나무', romanization: 'na-mu', english: 'tree', category: 'Vocab' },
      { id: 'vp1-17', korean: '나비', romanization: 'na-bi', english: 'butterfly', category: 'Vocab' },
      { id: 'vp1-18', korean: '바나나', romanization: 'ba-na-na', english: 'banana', category: 'Vocab' },
      { id: 'vp1-19', korean: '우유', romanization: 'u-yu', english: 'milk', category: 'Vocab' },
      { id: 'vp1-20', korean: '사과', romanization: 'sa-gwa', english: 'apple', category: 'Vocab' },
      { id: 'vp1-21', korean: '왜', romanization: 'wae', english: 'why', category: 'Vocab' },
      { id: 'vp1-22', korean: '더워요', romanization: 'deo-wo-yo', english: "it's hot", category: 'Vocab' },
      { id: 'vp1-23', korean: '가위', romanization: 'ga-wi', english: 'scissors', category: 'Vocab' },
      { id: 'vp1-24', korean: '오리', romanization: 'o-ri', english: 'duck', category: 'Vocab' },
      { id: 'vp1-25', korean: '토마토', romanization: 'to-ma-to', english: 'tomato', category: 'Vocab' },
      { id: 'vp1-26', korean: '의사', romanization: 'ui-sa', english: 'doctor', category: 'Vocab' },
      { id: 'vp1-27', korean: '모자', romanization: 'mo-ja', english: 'hat', category: 'Vocab' },
      { id: 'vp1-28', korean: '스웨터', romanization: 'seu-we-teo', english: 'sweater', category: 'Vocab' },
      { id: 'vp1-29', korean: '모래', romanization: 'mo-rae', english: 'sand', category: 'Vocab' },
      { id: 'vp1-30', korean: '의자', romanization: 'ui-ja', english: 'chair', category: 'Vocab' },
      { id: 'vp1-31', korean: '주사위', romanization: 'ju-sa-wi', english: 'dice', category: 'Vocab' }
    ]
  },
  {
    id: 'les-vocab-practice-quiz-1',
    order: 6,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '단어연습 1 퀴즈',
    description: 'Test your vocabulary knowledge on 단어연습1.',
    type: 'vocab quiz',
    pairedVocabId: 'les-vocab-practice-1',
    status: 'Active'
  },
  {
    id: 'les-vocab-practice-2',
    order: 7,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '단어연습 2',
    description: 'Korean vocabulary reading practice with 받침.',
    type: 'vocab',
    pairedQuizId: 'les-vocab-practice-quiz-2',
    status: 'Active',
    words: [
      { id: 'vp2-1', korean: '가방', romanization: 'ga-bang', english: 'bag', category: 'Vocab' },
      { id: 'vp2-2', korean: '교실', romanization: 'gyo-sil', english: 'classroom', category: 'Vocab' },
      { id: 'vp2-3', korean: '김치', romanization: 'gim-chi', english: 'kimchi', category: 'Vocab' },
      { id: 'vp2-4', korean: '돈', romanization: 'don', english: 'money', category: 'Vocab' },
      { id: 'vp2-5', korean: '당근', romanization: 'dang-geun', english: 'carrot', category: 'Vocab' },
      { id: 'vp2-6', korean: '리본', romanization: 'ri-bon', english: 'ribbon', category: 'Vocab' },
      { id: 'vp2-7', korean: '물', romanization: 'mul', english: 'water', category: 'Vocab' },
      { id: 'vp2-8', korean: '라면', romanization: 'ra-myeon', english: 'ramen', category: 'Vocab' },
      { id: 'vp2-9', korean: '사탕', romanization: 'sa-tang', english: 'candy', category: 'Vocab' },
      { id: 'vp2-10', korean: '수박', romanization: 'su-bak', english: 'watermelon', category: 'Vocab' },
      { id: 'vp2-11', korean: '양말', romanization: 'yang-mal', english: 'socks', category: 'Vocab' },
      { id: 'vp2-12', korean: '김밥', romanization: 'gim-bap', english: 'kimbap', category: 'Vocab' },
      { id: 'vp2-13', korean: '자전거', romanization: 'ja-jeon-geo', english: 'bicycle', category: 'Vocab' },
      { id: 'vp2-14', korean: '장갑', romanization: 'jang-gap', english: 'gloves', category: 'Vocab' },
      { id: 'vp2-15', korean: '지하철', romanization: 'ji-ha-cheol', english: 'subway', category: 'Vocab' },
      { id: 'vp2-16', korean: '친구', romanization: 'chin-gu', english: 'friend', category: 'Vocab' },
      { id: 'vp2-17', korean: '컴퓨터', romanization: 'keom-pyu-teo', english: 'computer', category: 'Vocab' },
      { id: 'vp2-18', korean: '풍선', romanization: 'pung-seon', english: 'balloon', category: 'Vocab' },
      { id: 'vp2-19', korean: '학교', romanization: 'hak-gyo', english: 'school', category: 'Vocab' },
      { id: 'vp2-20', korean: '호랑이', romanization: 'ho-rang-i', english: 'tiger', category: 'Vocab' }
    ]
  },
  {
    id: 'les-vocab-practice-quiz-2',
    order: 8,
    unit: 'Unit 1: Hangul & Korean Basics',
    title: '단어연습 2 퀴즈',
    description: 'Test your vocabulary knowledge on 단어연습2.',
    type: 'vocab quiz',
    pairedVocabId: 'les-vocab-practice-2',
    status: 'Active'
  }
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
        if (l.id === 'les-consonants-1') {
          return { ...l, words: DEFAULT_LESSONS[2].words };
        }
        if (l.id === 'les-vocab-practice-1') {
          return { ...l, words: DEFAULT_LESSONS[4].words };
        }
        if (l.id === 'les-vocab-practice-2') {
          return { ...l, words: DEFAULT_LESSONS[6].words };
        }
        if (l.type === 'vocab quiz') {
          const { words, ...quizLessonWithoutWords } = l;
          return quizLessonWithoutWords;
        }
        return l;
      });

      // Ensure newly added default lessons exist in stored list
      DEFAULT_LESSONS.forEach(dl => {
        if (!updated.some(ul => ul.id === dl.id)) {
          updated.push(dl);
        }
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
  assignedLessonIds = [
    'les-vowels-1', 'les-vowels-quiz-1',
    'les-consonants-1', 'les-consonants-quiz-1',
    'les-vocab-practice-1', 'les-vocab-practice-quiz-1',
    'les-vocab-practice-2', 'les-vocab-practice-quiz-2'
  ],
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
