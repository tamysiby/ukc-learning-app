import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { supabase, saveStoredSession } from '../services/supabaseClient';

const testStudentUser = {
  id: 'usr-test-1',
  name: 'Test Student',
  username: 'test.student',
  password: 'StudentPass123!',
  role: 'Student',
  status: 'Active',
  level: 'Beginner (Level 1)',
  progress: 0,
  streak: 0,
  mustChangePassword: true,
  assignedLessonIds: ['les-vowels-1'],
  completedLessonIds: []
};

function TestComponent() {
  const { currentUser, changeUserPassword, markLessonCompleted } = useAuth();

  return (
    <div>
      <div data-testid="must-change-pass">
        {currentUser?.mustChangePassword ? 'YES' : 'NO'}
      </div>
      <button
        onClick={() => changeUserPassword('BrandNewPass123!')}
        data-testid="btn-change-pass"
      >
        Change Password
      </button>
      <button
        onClick={() => markLessonCompleted(currentUser?.id, 'les-vowels-1')}
        data-testid="btn-mark-completed"
      >
        Mark Lesson Completed
      </button>
    </div>
  );
}

describe('Password Change Persistence & Lesson Launch Regression', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredSession(testStudentUser);
    vi.restoreAllMocks();

    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      return {
        update: () => ({
          eq: () => Promise.resolve({ error: null })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        }),
        insert: () => Promise.resolve({ error: null }),
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: testStudentUser, error: null })
        })
      };
    });
  });

  it('keeps mustChangePassword as false after password change even when marking a lesson completed', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state: mustChangePassword is true (YES)
    expect(screen.getByTestId('must-change-pass')).toHaveTextContent('YES');

    // Step 1: Change password
    const changeBtn = screen.getByTestId('btn-change-pass');
    await act(async () => {
      fireEvent.click(changeBtn);
    });

    // Verify mustChangePassword flipped to false (NO)
    await waitFor(() => {
      expect(screen.getByTestId('must-change-pass')).toHaveTextContent('NO');
    });

    // Step 2: Trigger lesson launch / mark completed
    const markCompletedBtn = screen.getByTestId('btn-mark-completed');
    await act(async () => {
      fireEvent.click(markCompletedBtn);
    });

    // ASSERTION: mustChangePassword MUST STAY false (NO) and NOT revert to true (YES)
    expect(screen.getByTestId('must-change-pass')).toHaveTextContent('NO');
  });
});
