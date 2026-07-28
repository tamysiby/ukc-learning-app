import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminUserManagement from '../components/AdminUserManagement';
import { AuthProvider } from '../context/AuthContext';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Admin User Management Screen', () => {
  const mockOnSelectUser = vi.fn();

  it('renders user search bar, filters, and initial user list', () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search users by name, username/i)).toBeInTheDocument();
    expect(screen.getAllByText('Min-ji Kim')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ji-hoon Park')[0]).toBeInTheDocument();
  });

  it('filters users correctly when searching text', () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    const searchInput = screen.getByPlaceholderText(/Search users by name, username/i);
    
    fireEvent.change(searchInput, { target: { value: 'Min-ji' } });
    expect(screen.getAllByText('Min-ji Kim')[0]).toBeInTheDocument();
    expect(screen.queryByText('Ji-hoon Park')).not.toBeInTheDocument();
  });

  it('triggers onSelectUser callback when View Details button is clicked', () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    const viewButtons = screen.getAllByTitle(/View details/i);
    expect(viewButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(viewButtons[0]);
    expect(mockOnSelectUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tae-hyun Choi (Admin)' }));
  });

  it('opens reset password modal when reset button is clicked', () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    const resetButtons = screen.getAllByTitle(/Reset Password/i);
    expect(resetButtons.length).toBeGreaterThan(0);

    fireEvent.click(resetButtons[0]);
    expect(screen.getByText('Reset Account Password')).toBeInTheDocument();
    expect(screen.getByText(/User will be required to change this password/i)).toBeInTheDocument();
  });

  it('renders user management header and interactive controls cleanly', () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    expect(screen.getByRole('button', { name: /Register Student/i })).toBeInTheDocument();
  });
});
