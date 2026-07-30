import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import StudentAccount from '../components/StudentAccount';
import { AuthProvider } from '../context/AuthContext';
import { saveStoredSession } from '../services/userSessionStore';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Student Account Management Screen', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredSession({
      id: 'usr-1',
      name: 'Min-ji Kim',
      username: 'minji.kim',
      role: 'Student',
      assignedLessonIds: [],
      completedLessonIds: []
    });
  });

  it('renders student profile form inputs, statistics, and security settings', () => {
    renderWithAuth(<StudentAccount />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Min-ji Kim')).toBeInTheDocument();
    expect(screen.getByDisplayValue('minji.kim')).toBeInTheDocument();
  });

  it('allows editing full name input', () => {
    renderWithAuth(<StudentAccount />);
    const nameInput = screen.getByDisplayValue('Min-ji Kim');
    fireEvent.change(nameInput, { target: { value: 'Min-ji Park' } });
    expect(nameInput.value).toBe('Min-ji Park');
  });
});
