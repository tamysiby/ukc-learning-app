import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLessonManagement from '../components/AdminLessonManagement';
import { AuthProvider } from '../context/AuthContext';
import { supabase, saveStoredSession } from '../services/supabaseClient';

const testFixtureUsers = [
  {
    id: 'usr-admin-1',
    name: 'Tae-hyun Choi (Admin)',
    username: 'admin',
    password: 'AdminPass123!',
    role: 'Admin',
    status: 'Active',
    level: 'Staff Administrator',
    progress: 100,
    streak: 45,
    lastActive: 'Just now',
    joinedDate: '2025-08-01',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1'],
    completedLessonIds: ['les-vowels-1']
  }
];

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

describe('Admin Lesson Management Portal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredSession({ id: 'usr-admin-1', username: 'admin', role: 'Admin' });
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
      if (tableName === 'users') dataToReturn = testFixtureUsers;
      if (tableName === 'lessons') dataToReturn = sampleTestLessons;

      return {
        select: () => createMockQuery(dataToReturn),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        upsert: () => createMockQuery(dataToReturn)
      };
    });
  });

  it('renders lesson management header and default platform lessons', async () => {
    renderWithAuth(<AdminLessonManagement />);
    expect(screen.getByText('Lesson Management')).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/Hangul Vowels|한글 모음/i)[0]).toBeInTheDocument());
  });

  it('opens manage student access modal when button is clicked', async () => {
    renderWithAuth(<AdminLessonManagement />);
    await waitFor(() => expect(screen.getAllByRole('button', { name: /Access|Manage Access/i }).length).toBeGreaterThan(0));
    const manageBtns = screen.getAllByRole('button', { name: /Access|Manage Access/i });

    fireEvent.click(manageBtns[0]);
    expect(screen.getByText(/Lesson Access Assignment/i)).toBeInTheDocument();
  });
});
