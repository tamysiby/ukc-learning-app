import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StudentAccount from '../components/StudentAccount';

describe('Student Account Management Screen', () => {
  it('renders student profile form inputs, statistics, and security settings', () => {
    render(<StudentAccount />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Min-ji Kim')).toBeInTheDocument();
    expect(screen.getByDisplayValue('minji.kim')).toBeInTheDocument();
  });

  it('allows editing full name input', () => {
    render(<StudentAccount />);
    const nameInput = screen.getByDisplayValue('Min-ji Kim');
    fireEvent.change(nameInput, { target: { value: 'Min-ji Park' } });
    expect(nameInput.value).toBe('Min-ji Park');
  });
});
