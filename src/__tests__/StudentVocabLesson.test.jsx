import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VocabLesson from '../lessons/vocab/VocabLesson';

describe('Student Vocab Flashcard Lesson Screen', () => {
  const mockFinishLesson = vi.fn();

  it('renders initial flashcard with Korean word and flip card prompt', () => {
    render(<VocabLesson onFinishLesson={mockFinishLesson} />);
    expect(screen.getByText(/Tap to flip/i)).toBeInTheDocument();
  });

  it('flips card to reveal English translation when clicked', () => {
    render(<VocabLesson onFinishLesson={mockFinishLesson} />);
    const flashcard = screen.getByTestId('flashcard-container');
    
    // Initially English answer is hidden or on back side
    fireEvent.click(flashcard);
    expect(screen.getByText('Hello / Good day (Formal)')).toBeInTheDocument();
  });

  it('navigates with Next and Previous buttons', () => {
    render(<VocabLesson onFinishLesson={mockFinishLesson} />);
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    
    expect(prevBtn).toBeDisabled();
    fireEvent.click(nextBtn);
    expect(prevBtn).not.toBeDisabled();
    
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
  });
});
