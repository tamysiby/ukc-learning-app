import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { saveStoredUsers, getStoredUsers, initialMockUsers } from '../services/supabaseClient';

describe('UKC Learning App Authentic Auth & Protected Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    saveStoredUsers(initialMockUsers.map(u => ({ ...u, isOnline: false, activeSessionId: null })));
  });

  it('renders landing login page when unauthenticated', () => {
    render(<App />);
    expect(screen.getByText('UKC Learning Portal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@ukc.edu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('logs in as Admin via quick demo shortcut and renders Admin User Management', async () => {
    render(<App />);
    
    const adminDemoBtn = screen.getByRole('button', { name: /Admin Login/i });
    fireEvent.click(adminDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/User Management/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Test logout button returns to login page
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('logs in as Student via quick demo shortcut and renders Student Lesson Pathway', async () => {
    render(<App />);
    
    const studentDemoBtn = screen.getByRole('button', { name: /Student Login/i });
    fireEvent.click(studentDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('detects when an active session is superseded by a new login and logs out older session', async () => {
    render(<App />);

    // Log in as student
    const studentDemoBtn = screen.getByRole('button', { name: /Student Login/i });
    fireEvent.click(studentDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument();
    }, { timeout: 3000 });

    // Simulate a new login from another session updating the database/storage
    const users = getStoredUsers();
    const updatedUsers = users.map(u => {
      if (u.id === 'usr-1') {
        return { ...u, activeSessionId: 'sess_NEW_SESSION_999' };
      }
      return u;
    });

    act(() => {
      saveStoredUsers(updatedUsers);
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ukc_app_users_db_v1',
        newValue: JSON.stringify(updatedUsers)
      }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Your account was logged in from another session/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
