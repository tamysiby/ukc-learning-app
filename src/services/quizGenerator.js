import { hasVocabIllustration } from '../components/VocabIllustration';

/**
 * Dynamic Vocab Quiz Generator
 * Generates a 10-question randomized quiz from a lesson's vocabulary words.
 *
 * Rules:
 * - Exactly 10 questions (2 Matching, 8 Question items).
 * - If illustration exists for a word, English text is replaced by the picture in questions/prompts.
 * - If picture exists and answer is supposed to be English, answer MUST ONLY be multiple_choice.
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
      word: w,
      text: isReverse ? (w.english || w.romanization) : w.korean,
      showIllustration: isReverse && hasVocabIllustration(w)
    }));

    const rightCol = matchedWords.map(w => ({
      id: w.id,
      word: w,
      text: isReverse ? w.korean : (w.english || w.romanization),
      showIllustration: !isReverse && hasVocabIllustration(w)
    }));

    questions.push({
      id: `q-matching-${i + 1}`,
      type: 'matching',
      pairs: matchedWords.map(w => ({
        id: w.id,
        korean: w.korean,
        answer: w.english || w.romanization
      })),
      leftItems: shuffle(leftCol),
      rightItems: shuffle(rightCol)
    });
  }

  // 2. Generate 8 Question Items
  for (let i = 0; i < 8; i++) {
    const targetWord = vocabWords[i % vocabWords.length] || vocabWords[0];
    const rand = Math.random();
    const hasIllust = hasVocabIllustration(targetWord);

    // isReverse = true  -> Answer is Korean (Prompt is Picture/English)
    // isReverse = false -> Answer is English (Prompt is Korean/Picture)
    let isReverse = Math.random() < 0.5;

    let questionType;
    if (rand < 0.5) {
      questionType = 'multiple_choice';
    } else if (rand < 0.8) {
      questionType = 'syllable_blocks';
    } else {
      questionType = 'keyboard_input';
    }

    // RULE: If picture exists and answer is supposed to be English (!isReverse),
    // answer MUST ONLY be multiple_choice.
    if (hasIllust && !isReverse) {
      questionType = 'multiple_choice';
    }

    const distractors = getDistractors(targetWord, 3);
    const correctAnswer = isReverse ? targetWord.korean : (targetWord.english || targetWord.romanization);

    if (questionType === 'multiple_choice') {
      const choices = shuffle([
        {
          word: targetWord,
          text: correctAnswer,
          showIllustration: !isReverse && hasIllust,
          isCorrect: true
        },
        ...distractors.map(d => ({
          word: d,
          text: isReverse ? d.korean : (d.english || d.romanization),
          showIllustration: !isReverse && hasVocabIllustration(d),
          isCorrect: false
        }))
      ]);

      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'multiple_choice',
        targetWord: targetWord,
        hasIllustration: hasIllust,
        isReverse: isReverse,
        targetKorean: isReverse ? (targetWord.english || targetWord.romanization) : targetWord.korean,
        correctAnswer: correctAnswer,
        options: choices
      });

    } else if (questionType === 'syllable_blocks') {
      const distractorTexts = distractors.map(d => isReverse ? d.korean : (d.english || d.romanization));
      const allBlocks = shuffle(Array.from(new Set([correctAnswer, ...distractorTexts])));

      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'syllable_blocks',
        targetWord: targetWord,
        hasIllustration: hasIllust,
        isReverse: isReverse,
        targetKorean: isReverse ? (targetWord.english || targetWord.romanization) : targetWord.korean,
        correctAnswer: correctAnswer,
        blocks: allBlocks
      });

    } else {
      questions.push({
        id: `q-fill-${i + 1}`,
        type: 'keyboard_input',
        targetWord: targetWord,
        hasIllustration: hasIllust,
        isReverse: isReverse,
        targetKorean: isReverse ? (targetWord.english || targetWord.romanization) : targetWord.korean,
        correctAnswer: correctAnswer
      });
    }
  }

  // Shuffle the questions array so quiz question types appear in randomized order
  return shuffle(questions);
}
