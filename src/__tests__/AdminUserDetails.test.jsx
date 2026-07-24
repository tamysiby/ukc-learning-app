import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminUserDetails from '../components/AdminUserDetails';

describe('Admin User Details Screen', () => {
  const sampleUser = {
    id: 'usr-1',
    name: 'Min-ji Kim',
    email: 'minji.kim@ukc.edu',
    role: 'Student',
    status: 'Active',
    level: 'Intermediate (Level 3)',
    progress: 78,
    streak: 14,
    lastActive: '10 mins ago',
    joinedDate: '2026-01-15'
  };

  const mockBack = vi.fn();

  it('renders student header details, progress stats, and back button', () => {
    render(<AdminUserDetails user={sampleUser} onBack={mockBack} />);
    expect(screen.getByText('Min-ji Kim')).toBeInTheDocument();
    expect(screen.getByText('minji.kim@ukc.edu')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('14 Days')).toBeInTheDocument();
  });

  it('calls onBack when Back to Users list button is clicked', () => {
    render(<AdminUserDetails user={sampleUser} onBack={mockBack} />);
    const backBtn = screen.getByRole('button', { name: /Back to User List/i });
    fireEvent.click(backBtn);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
