import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentLessonPathway from '../components/StudentLessonPathway';

describe('Student Lesson Pathway Screen', () => {
  const mockStartLesson = vi.fn();

  it('renders student learning path, active unit title, and streak info', () => {
    render(<StudentLessonPathway onStartLesson={mockStartLesson} />);
    expect(screen.getByText(/Korean Foundations/i)).toBeInTheDocument();
    expect(screen.getByText(/Unit 3: Essential Vocabulary/i)).toBeInTheDocument();
  });

  it('triggers onStartLesson when Start Vocab Lesson button is clicked', () => {
    render(<StudentLessonPathway onStartLesson={mockStartLesson} />);
    const startBtn = screen.getByRole('button', { name: /Start Vocab Lesson/i });
    fireEvent.click(startBtn);
    expect(mockStartLesson).toHaveBeenCalledTimes(1);
  });
});
