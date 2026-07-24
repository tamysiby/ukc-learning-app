import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentLessonPathway from '../components/StudentLessonPathway';
import { AuthProvider } from '../context/AuthContext';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Student Lesson Pathway Screen', () => {
  const mockHangul = vi.fn();
  const mockVocab = vi.fn();

  it('renders student learning path, active unit title, and streak info', () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    expect(screen.getByText(/Korean Foundations/i)).toBeInTheDocument();
    expect(screen.getByText(/Unit 1: Hangul & Korean Basics/i)).toBeInTheDocument();
  });

  it('triggers onStartHangulLesson when Start Lesson button is clicked', () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    const startBtns = screen.getAllByRole('button', { name: /Start Lesson/i });
    expect(startBtns.length).toBeGreaterThan(0);
    fireEvent.click(startBtns[0]);
    expect(mockHangul).toHaveBeenCalledTimes(1);
  });
});
