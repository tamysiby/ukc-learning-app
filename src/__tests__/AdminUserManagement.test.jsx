import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminUserManagement from '../components/AdminUserManagement';
import { AuthProvider } from '../context/AuthContext';
import { initialMockUsers, supabase, saveStoredSession } from '../services/supabaseClient';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Admin User Management Screen', () => {
  const mockOnSelectUser = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredSession({ id: 'usr-admin-1', username: 'admin', role: 'Admin' });
    vi.restoreAllMocks();

    const createMockQuery = (data) => {
      const promise = Promise.resolve({ data, error: null });
      promise.eq = () => createMockQuery(data);
      promise.order = () => createMockQuery(data);
      promise.single = () => {
        const item = Array.isArray(data) ? data[0] : data;
        return Promise.resolve({ data: item || null, error: item ? null : { code: 'PGRST116' } });
      };
      return promise;
    };

    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      const defaultUserList = initialMockUsers.map(u => ({
        ...u,
        is_online: false,
        created_at: u.joinedDate ? `${u.joinedDate}T00:00:00Z` : '2026-01-01T00:00:00Z'
      }));
      return {
        select: () => createMockQuery(tableName === 'users' ? defaultUserList : []),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        insert: () => Promise.resolve({ error: null }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
        upsert: () => Promise.resolve({ error: null })
      };
    });
  });

  it('renders user search bar, filters, and initial user list', async () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search users by name, username/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Min-ji Kim')).toBeInTheDocument(), { timeout: 3000 });
    expect(screen.getByText('Ji-hoon Park')).toBeInTheDocument();
  });

  it('filters users correctly when searching text', async () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    await waitFor(() => expect(screen.getByText('Min-ji Kim')).toBeInTheDocument(), { timeout: 3000 });

    const searchInput = screen.getByPlaceholderText(/Search users by name, username/i);
    fireEvent.change(searchInput, { target: { value: 'Min-ji' } });
    expect(screen.getByText('Min-ji Kim')).toBeInTheDocument();
    expect(screen.queryByText('Ji-hoon Park')).not.toBeInTheDocument();
  });

  it('triggers onSelectUser callback when View Details button is clicked', async () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    await waitFor(() => expect(screen.getByText('Min-ji Kim')).toBeInTheDocument(), { timeout: 3000 });

    const viewButtons = screen.getAllByTitle(/View/i);
    expect(viewButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(viewButtons[0]);
    expect(mockOnSelectUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tae-hyun Choi (Admin)' }));
  });

  it('opens reset password modal when reset button is clicked', async () => {
    renderWithAuth(<AdminUserManagement onSelectUser={mockOnSelectUser} />);
    await waitFor(() => expect(screen.getByText('Min-ji Kim')).toBeInTheDocument(), { timeout: 3000 });

    const resetButtons = screen.getAllByTitle(/Reset/i);
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
