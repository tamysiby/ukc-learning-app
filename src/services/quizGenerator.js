/**
 * Dynamic Vocab Quiz Generator
 * Generates a 10-question randomized quiz from a lesson's vocabulary words.
 *
 * Streamlined Data Structure:
 * - Exactly 10 questions.
 * - 2 questions in Matching format.
 * - 8 fill-in-the-blank questions (50% MC, 30% Syllable Blocks, 20% Keyboard Typing).
 * - Shuffled question order.
 * - Randomized direction: Korean -> English or English -> Korean.
 */
export function generateRandomVocabQuiz(vocabWords = []) {
  if (!vocabWords || vocabWords.length === 0) {
    return [];
  }

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const questions = [];

  // Helper to pick distractor words
  const getDistractors = (correctWord, count = 3) => {
    const pool = vocabWords.filter(w => w.korean !== correctWord.korean);
    const shuffledPool = shuffle(pool);
    return shuffledPool.slice(0, count);
  };

  // 1. Generate 2 Matching Questions
  for (let i = 0; i < 2; i++) {
    const sampleSize = Math.min(4, vocabWords.length);
    const matchedWords = shuffle(vocabWords).slice(0, sampleSize);
    const isReverse = Math.random() < 0.5;

    const leftCol = matchedWords.map(w => ({
      id: w.id,
      text: isReverse ? (w.romanization || w.english) : w.korean
    }));

    const rightCol = matchedWords.map(w => ({
      id: w.id,
      text: isReverse ? w.korean : (w.romanization || w.english)
    }));

    questions.push({
      id: `q-matching-${i + 1}`,
      type: 'matching',
      pairs: matchedWords.map(w => ({
        id: w.id,
        korean: w.korean,
        answer: w.romanization || w.english
      })),
      leftItems: shuffle(leftCol),
      rightItems: shuffle(rightCol)
    });
  }

  // 2. Generate 8 Fill-in-the-blank Questions
  for (let i = 0; i < 8; i++) {
    const targetWord = vocabWords[i % vocabWords.length] || vocabWords[0];
    const rand = Math.random();
    const isReverse = Math.random() < 0.5;

    let questionType;
    if (rand < 0.5) {
      questionType = 'multiple_choice';
    } else if (rand < 0.8) {
      questionType = 'syllable_blocks';
    } else {
      questionType = 'keyboard_input';
    }

    const distractors = getDistractors(targetWord, 3);
    const promptWord = isReverse ? (targetWord.romanization || targetWord.english) : targetWord.korean;
    const correctAnswer = isReverse ? targetWord.korean : (targetWord.romanization || targetWord.english);

    if (questionType === 'multiple_choice') {
      const choices = shuffle([
        { text: correctAnswer, isCorrect: true },
        ...distractors.map(d => ({
          text: isReverse ? d.korean : (d.romanization || d.english),
          isCorrect: false
        }))
      ]);

      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'multiple_choice',
        targetKorean: promptWord,
        correctAnswer: correctAnswer,
        options: choices
      });

    } else if (questionType === 'syllable_blocks') {
      const distractorTexts = distractors.map(d => isReverse ? d.korean : (d.romanization || d.english));
      const allBlocks = shuffle(Array.from(new Set([correctAnswer, ...distractorTexts])));

      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'syllable_blocks',
        targetKorean: promptWord,
        correctAnswer: correctAnswer,
        blocks: allBlocks
      });

    } else {
      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'keyboard_input',
        targetKorean: promptWord,
        correctAnswer: correctAnswer
      });
    }
  }

  // Shuffle the questions array so quiz question types appear in randomized order
  return shuffle(questions);
}
