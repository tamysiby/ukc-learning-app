import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { generateRandomVocabQuiz } from '../services/quizGenerator';
import VocabQuizLesson from '../lessons/vocab/VocabQuizLesson';

describe('Dynamic Vocab Quiz Generator & Component', () => {
  const sampleWords = [
    { id: 'v-1', korean: 'ㅏ', romanization: 'a', english: 'a' },
    { id: 'v-2', korean: 'ㅓ', romanization: 'eo', english: 'eo' },
    { id: 'v-3', korean: 'ㅗ', romanization: 'o', english: 'o' },
    { id: 'v-4', korean: 'ㅜ', romanization: 'u', english: 'u' },
    { id: 'v-5', korean: 'ㅡ', romanization: 'eu', english: 'eu' },
    { id: 'v-6', korean: 'ㅣ', romanization: 'i', english: 'i' },
    { id: 'v-7', korean: 'ㅔ', romanization: 'e', english: 'e' },
    { id: 'v-8', korean: 'ㅐ', romanization: 'ae', english: 'ae' }
  ];

  it('generates exactly 10 questions with 2 matching questions and 8 fill-in-the-blank questions in randomized order', () => {
    const questions = generateRandomVocabQuiz(sampleWords);
    expect(questions.length).toBe(10);
    
    const matchingQuestions = questions.filter(q => q.type === 'matching');
    const fillInQuestions = questions.filter(q => ['multiple_choice', 'syllable_blocks', 'keyboard_input'].includes(q.type));

    expect(matchingQuestions.length).toBe(2);
    expect(fillInQuestions.length).toBe(8);
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
});
