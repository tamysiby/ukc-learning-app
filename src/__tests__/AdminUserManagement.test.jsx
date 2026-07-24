import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminUserManagement from '../components/AdminUserManagement';

describe('Admin User Management Screen', () => {
  const mockOnSelectUser = vi.fn();

  it('renders user search bar, filters, and initial user list', () => {
    render(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search users by name, email/i)).toBeInTheDocument();
    expect(screen.getAllByText('Min-ji Kim')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ji-hoon Park')[0]).toBeInTheDocument();
  });

  it('filters users correctly when searching text', () => {
    render(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    const searchInput = screen.getByPlaceholderText(/Search users by name, email/i);
    
    fireEvent.change(searchInput, { target: { value: 'Min-ji' } });
    expect(screen.getAllByText('Min-ji Kim')[0]).toBeInTheDocument();
    expect(screen.queryByText('Ji-hoon Park')).not.toBeInTheDocument();
  });

  it('triggers onSelectUser callback when View Details or Student Progress button is clicked', () => {
    render(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    const viewButtons = screen.getAllByText(/View Details|View Student Progress/i);
    expect(viewButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(viewButtons[0]);
    expect(mockOnSelectUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Min-ji Kim' }));
  });
});
