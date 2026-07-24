import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../components/LoginPage';
import { AuthProvider } from '../context/AuthContext';

describe('LoginPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form with email, password, and restricted access notice', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('UKC Learning Portal')).toBeInTheDocument();
    expect(screen.getByText(/Public sign-up is disabled/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@ukc.edu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••••••')).toBeInTheDocument();
  });

  it('shows error badge when invalid credentials are submitted', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText('name@ukc.edu');
    const passInput = screen.getByPlaceholderText('••••••••••••');
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    fireEvent.change(emailInput, { target: { value: 'unknown@ukc.edu' } });
    fireEvent.change(passInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Account not found/i)).toBeInTheDocument();
    });
  });
});
