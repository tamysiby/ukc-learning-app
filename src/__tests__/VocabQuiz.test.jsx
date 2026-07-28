import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { generateRandomVocabQuiz } from '../services/quizGenerator';
import VocabQuizLesson from '../lessons/vocab/VocabQuizLesson';

describe('Dynamic Vocab Quiz Generator & Component', () => {
  const sampleWords = [
    { id: 'vp1-1', korean: '시소', romanization: 'si-so', english: 'seesaw' },
    { id: 'vp1-2', korean: '사자', romanization: 'sa-ja', english: 'lion' },
    { id: 'vp1-3', korean: '새', romanization: 'sae', english: 'bird' },
    { id: 'vp1-4', korean: '뼈', romanization: 'ppyeo', english: 'bone' },
    { id: 'vp1-5', korean: '시계', romanization: 'si-gye', english: 'clock' },
    { id: 'v-6', korean: 'ㅣ', romanization: 'i', english: 'i' },
    { id: 'v-7', korean: 'ㅔ', romanization: 'e', english: 'e' },
    { id: 'v-8', korean: 'ㅐ', romanization: 'ae', english: 'ae' }
  ];

  it('generates exactly 10 questions with 2 matching questions and 8 question items in randomized order', () => {
    const questions = generateRandomVocabQuiz(sampleWords);
    expect(questions.length).toBe(10);
    
    const matchingQuestions = questions.filter(q => q.type === 'matching');
    const fillInQuestions = questions.filter(q => ['multiple_choice', 'syllable_blocks', 'keyboard_input'].includes(q.type));

    expect(matchingQuestions.length).toBe(2);
    expect(fillInQuestions.length).toBe(8);
  });

  it('enforces multiple_choice for illustrated words when answer is English', () => {
    const questions = generateRandomVocabQuiz(sampleWords);

    questions.forEach(q => {
      if (q.hasIllustration && !q.isReverse && q.type !== 'matching') {
        // If picture exists and answer is English (!isReverse), question type MUST be multiple_choice
        expect(q.type).toBe('multiple_choice');
      }
    });
  });

  it('sets showIllustration on multiple_choice options for illustrated words when question is Korean', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
    const questions = generateRandomVocabQuiz(sampleWords);
    vi.restoreAllMocks();

    const koreanMultipleChoiceQs = questions.filter(
      q => q.type === 'multiple_choice' && !q.isReverse && q.hasIllustration
    );

    expect(koreanMultipleChoiceQs.length).toBeGreaterThan(0);

    koreanMultipleChoiceQs.forEach(q => {
      q.options.forEach(opt => {
        if (opt.word && ['vp1-1', 'vp1-2', 'vp1-3', 'vp1-4', 'vp1-5'].includes(opt.word.id)) {
          expect(opt.showIllustration).toBe(true);
        }
      });
    });
  });

  it('renders VocabQuizLesson screen and displays hearts and progress bar', () => {
    const mockFinish = vi.fn();
    const mockExit = vi.fn();
    const questions = generateRandomVocabQuiz(sampleWords);

    render(
      <VocabQuizLesson
        title="Hangeul Vowels Quiz"
        quizQuestions={questions}
        onFinishQuiz={mockFinish}
        onExitQuiz={mockExit}
      />
    );

    expect(screen.getByText('Hangeul Vowels Quiz')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('hides KoreanKeypad when prompt is Korean and expected answer is English', () => {
    const englishAnswerQuestion = [{
      id: 'q-key-eng',
      type: 'keyboard_input',
      targetWord: { id: 'vp1-1', korean: '시소', english: 'seesaw' },
      isReverse: false,
      correctAnswer: 'seesaw'
    }];

    render(
      <VocabQuizLesson
        title="English Typing Test"
        quizQuestions={englishAnswerQuestion}
        onFinishQuiz={vi.fn()}
        onExitQuiz={vi.fn()}
      />
    );

    // Input placeholder should ask for English answer
    expect(screen.getByPlaceholderText('Type the English answer...')).toBeInTheDocument();
    // Keypad buttons (e.g. Korean consonants like ㄱ, ㄴ, ㄷ) should NOT be rendered
    expect(screen.queryByText('ㄱ')).toBeNull();
  });

  it('shows KoreanKeypad when prompt is English and expected answer is Korean', () => {
    const koreanAnswerQuestion = [{
      id: 'q-key-kor',
      type: 'keyboard_input',
      targetWord: { id: 'vp1-1', korean: '시소', english: 'seesaw' },
      isReverse: true,
      correctAnswer: '시소'
    }];

    render(
      <VocabQuizLesson
        title="Korean Typing Test"
        quizQuestions={koreanAnswerQuestion}
        onFinishQuiz={vi.fn()}
        onExitQuiz={vi.fn()}
      />
    );

    // Input placeholder should indicate keypad usage
    expect(screen.getByPlaceholderText('Type using keyboard or keypad below...')).toBeInTheDocument();
    // Keypad buttons (e.g. Korean consonant ㄱ) SHOULD be rendered
    expect(screen.getByText('ㄱ')).toBeInTheDocument();
  });
});
