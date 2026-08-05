import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VocabLesson from '../lessons/vocab/VocabLesson';

describe('Student Vocab Flashcard Lesson Screen', () => {
  const mockFinishLesson = vi.fn();
  const sampleWords = [
    { id: 'fc-1', korean: '안녕하세요', romanization: 'An-nyeong-ha-se-yo', english: 'Hello / Good day (Formal)', category: 'Greetings' },
    { id: 'fc-2', korean: '감사합니다', romanization: 'Gam-sa-ham-ni-da', english: 'Thank you (Formal)', category: 'Etiquette' }
  ];

  it('renders initial flashcard with Korean word and flip card prompt', () => {
    render(<VocabLesson words={sampleWords} onFinishLesson={mockFinishLesson} />);
    expect(screen.getByText(/Tap to flip/i)).toBeInTheDocument();
  });

  it('flips card to reveal English translation when clicked', () => {
    render(<VocabLesson words={sampleWords} onFinishLesson={mockFinishLesson} />);
    const flashcard = screen.getByTestId('flashcard-container');
    
    fireEvent.click(flashcard);
    expect(screen.getByText('Hello / Good day (Formal)')).toBeInTheDocument();
  });

  it('navigates with Next and Previous buttons', () => {
    render(<VocabLesson words={sampleWords} onFinishLesson={mockFinishLesson} />);
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    
    expect(prevBtn).toBeDisabled();
    fireEvent.click(nextBtn);
    expect(prevBtn).not.toBeDisabled();
    
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
  });
});
