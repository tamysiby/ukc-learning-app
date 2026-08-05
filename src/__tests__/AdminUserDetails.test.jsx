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
    username: 'minji.kim',
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
    expect(screen.getByText('minji.kim')).toBeInTheDocument();
    expect(screen.getByText('14 Days')).toBeInTheDocument();
  });

  it('calls onBack when Back to Users list button is clicked', () => {
    renderWithAuth(<AdminUserDetails user={sampleUser} onBack={mockBack} />);
    const backBtn = screen.getByRole('button', { name: /Back to User List/i });
    fireEvent.click(backBtn);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders dynamic activity log items for completed lessons and portal activity', () => {
    const userWithActivity = {
      ...sampleUser,
      completedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1'],
      lastActive: '10 mins ago'
    };
    renderWithAuth(<AdminUserDetails user={userWithActivity} onBack={mockBack} />);
    
    expect(screen.getByText(/Recent Activity Log/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed Lesson:/i)).toBeInTheDocument();
    expect(screen.getByText(/Passed Quiz:/i)).toBeInTheDocument();
    expect(screen.getByText(/Portal Activity/i)).toBeInTheDocument();
  });

  it('renders empty activity log message when student has no recorded activity', () => {
    const userWithNoActivity = {
      ...sampleUser,
      completedLessonIds: [],
      lastActive: 'Never'
    };
    renderWithAuth(<AdminUserDetails user={userWithNoActivity} onBack={mockBack} />);
    
    expect(screen.getByText(/No recent activity recorded for this student/i)).toBeInTheDocument();
  });

  it('renders lesson completion progress stat and filter tabs', () => {
    const userWithCompleted = {
      ...sampleUser,
      completedLessonIds: ['les-vowels-1']
    };
    renderWithAuth(<AdminUserDetails user={userWithCompleted} onBack={mockBack} />);

    expect(screen.getByText(/Lessons Completed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Completed \(/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Incomplete \(/i })).toBeInTheDocument();

    // Click Completed filter tab
    const completedTab = screen.getByRole('button', { name: /Completed \(/i });
    fireEvent.click(completedTab);
    expect(completedTab.className).toContain('bg-primary');
  });
});
