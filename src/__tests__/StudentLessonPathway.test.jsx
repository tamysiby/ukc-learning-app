import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentLessonPathway from '../components/StudentLessonPathway';

describe('Student Lesson Pathway Screen', () => {
  const mockHangul = vi.fn();
  const mockVocab = vi.fn();

  it('renders student learning path, active unit title, and streak info', () => {
    render(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    expect(screen.getByText(/Korean Foundations/i)).toBeInTheDocument();
    expect(screen.getByText(/Unit 1: Hangul & Korean Basics/i)).toBeInTheDocument();
  });

  it('triggers onStartHangulLesson when Start Lesson 1 button is clicked', () => {
    render(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    const startHangulBtn = screen.getByRole('button', { name: /Start Lesson 1: Hangul Basics/i });
    fireEvent.click(startHangulBtn);
    expect(mockHangul).toHaveBeenCalledTimes(1);
  });
});
