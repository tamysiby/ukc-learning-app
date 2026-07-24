import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentVocabLesson from '../components/StudentVocabLesson';

describe('Student Vocab Flashcard Lesson Screen', () => {
  const mockFinishLesson = vi.fn();

  it('renders initial flashcard with Korean word and flip card button', () => {
    render(<StudentVocabLesson onFinishLesson={mockFinishLesson} />);
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
    expect(screen.getByText(/Tap card to flip/i)).toBeInTheDocument();
  });

  it('flips card to reveal English translation when clicked', () => {
    render(<StudentVocabLesson onFinishLesson={mockFinishLesson} />);
    const flashcard = screen.getByTestId('flashcard-container');
    
    // Initially English answer is hidden or on back side
    fireEvent.click(flashcard);
    expect(screen.getByText('Hello / Good day (Formal)')).toBeInTheDocument();
  });

  it('advances to next card when marking rating (Easy / Need Practice)', () => {
    render(<StudentVocabLesson onFinishLesson={mockFinishLesson} />);
    const easyBtn = screen.getByRole('button', { name: /Got It Easy/i });
    
    fireEvent.click(easyBtn);
    // Should advance to 2nd card (감사합니다)
    expect(screen.getByText('감사합니다')).toBeInTheDocument();
  });
});
