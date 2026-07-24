import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('UKC Learning App Root & Navigation', () => {
  it('renders top brand title and navigation role switcher', () => {
    render(<App />);
    expect(screen.getAllByText(/UKC Learning/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Student$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Admin$/i })).toBeInTheDocument();
  });

  it('switches between Student view and Admin view when clicking mode buttons', () => {
    render(<App />);
    
    // Default should be Student Pathway or Student view
    expect(screen.getAllByText(/Pathway/i)[0]).toBeInTheDocument();

    // Click Admin Mode button
    const adminBtn = screen.getByRole('button', { name: /^Admin$/i });
    fireEvent.click(adminBtn);

    // Should render Admin User Management view
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search users by name, email/i)).toBeInTheDocument();

    // Click Student Mode button back
    const studentBtn = screen.getByRole('button', { name: /^Student$/i });
    fireEvent.click(studentBtn);
    expect(screen.getAllByText(/Pathway/i)[0]).toBeInTheDocument();
  });
});
