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

  it('renders student learning path and assigned lesson titles', () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument();
  });

  it('triggers lesson launch handler when Start Lesson button is clicked', () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    const startBtns = screen.getAllByRole('button', { name: /Start Lesson/i });
    expect(startBtns.length).toBeGreaterThan(0);
    fireEvent.click(startBtns[0]);
    expect(mockVocab.mock.calls.length + mockHangul.mock.calls.length).toBeGreaterThan(0);
  });
});
