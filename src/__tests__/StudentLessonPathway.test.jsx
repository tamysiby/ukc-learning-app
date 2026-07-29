import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentLessonPathway from '../components/StudentLessonPathway';
import { AuthProvider } from '../context/AuthContext';

import { initialMockUsers, supabase, saveStoredSession } from '../services/supabaseClient';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

const sampleTestLessons = [
  { id: 'les-vowels-1', order_index: 1, unit: 'Unit 1: Hangul & Korean Basics', title: '한글 모음', type: 'vocab', paired_quiz_id: 'les-vowels-quiz-1', status: 'Active', words: [] },
  { id: 'les-vowels-quiz-1', order_index: 2, unit: 'Unit 1: Hangul & Korean Basics', title: '한글 모음 퀴즈', type: 'vocab quiz', paired_vocab_id: 'les-vowels-1', status: 'Active' }
];

describe('Student Lesson Pathway Screen', () => {
  const mockHangul = vi.fn();
  const mockVocab = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredSession({ id: 'usr-student-1', username: 'student1', role: 'Student', assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1'], completedLessonIds: [] });
    vi.restoreAllMocks();

    const createMockQuery = (data) => {
      const promise = Promise.resolve({ data, error: null });
      promise.eq = () => createMockQuery(data);
      promise.order = () => createMockQuery(data);
      promise.single = () => Promise.resolve({ data: Array.isArray(data) ? data[0] : data, error: null });
      return promise;
    };

    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      let dataToReturn = [];
      if (tableName === 'users') dataToReturn = initialMockUsers;
      if (tableName === 'lessons') dataToReturn = sampleTestLessons;

      return {
        select: () => createMockQuery(dataToReturn),
        update: () => ({ eq: () => Promise.resolve({ error: null }) })
      };
    });
  });

  it('renders student learning path and assigned lesson titles', async () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    await waitFor(() => expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument(), { timeout: 3000 });
  });

  it('triggers lesson launch handler when Start Lesson button is clicked', async () => {
    renderWithAuth(<StudentLessonPathway onStartHangulLesson={mockHangul} onStartVocabLesson={mockVocab} />);
    await waitFor(() => expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument(), { timeout: 3000 });
    const startBtns = screen.getAllByRole('button', { name: /Study Lesson|Take Quiz/i });
    expect(startBtns.length).toBeGreaterThan(0);
    fireEvent.click(startBtns[0]);
    expect(mockVocab.mock.calls.length + mockHangul.mock.calls.length).toBeGreaterThan(0);
  });
});
