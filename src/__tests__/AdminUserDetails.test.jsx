import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminUserDetails from '../components/AdminUserDetails';
import { AuthProvider } from '../context/AuthContext';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Admin User Details Screen', () => {
  const sampleUser = {
    id: 'usr-1',
    name: 'Min-ji Kim',
    email: 'minji.kim@ukc.edu',
    role: 'Student',
    status: 'Active',
    streak: 14,
    lastActive: '10 mins ago',
    joinedDate: '2026-01-15',
    assignedLessonIds: ['les-hangul-1', 'les-vocab-1']
  };

  const mockBack = vi.fn();

  it('renders student header details, study streak, and back button', () => {
    renderWithAuth(<AdminUserDetails user={sampleUser} onBack={mockBack} />);
    expect(screen.getByText('Min-ji Kim')).toBeInTheDocument();
    expect(screen.getByText('minji.kim@ukc.edu')).toBeInTheDocument();
    expect(screen.getByText('14 Days')).toBeInTheDocument();
  });

  it('calls onBack when Back to Users list button is clicked', () => {
    renderWithAuth(<AdminUserDetails user={sampleUser} onBack={mockBack} />);
    const backBtn = screen.getByRole('button', { name: /Back to User List/i });
    fireEvent.click(backBtn);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
