import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HangulLesson from '../lessons/hangul/HangulLesson';

describe('HangulLesson Component', () => {
  const mockFinish = vi.fn();

  it('renders Lesson 1 header and intro step by default', () => {
    render(<HangulLesson onFinishLesson={mockFinish} />);
    expect(screen.getByText(/Introduction to Hangul & 음절/i)).toBeInTheDocument();
    expect(screen.getByText(/What is Hangul \(한글\)\?/i)).toBeInTheDocument();
  });

  it('allows navigating between steps (Consonants, Vowels, Syllable Rules, Builder)', () => {
    render(<HangulLesson onFinishLesson={mockFinish} />);

    // Click Consonants tab
    const consonantsTab = screen.getByText('2. Consonants (자음)');
    fireEvent.click(consonantsTab);
    expect(screen.getByText(/14 Basic Consonants \(자음\)/i)).toBeInTheDocument();
    expect(screen.getByText('Giyeok')).toBeInTheDocument();

    // Click Interactive Builder tab
    const builderTab = screen.getByText('5. Interactive Builder');
    fireEvent.click(builderTab);
    expect(screen.getByText(/Interactive Syllable Block Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Formed Syllable Block/i)).toBeInTheDocument();
  });

  it('calls onFinishLesson when Back to Pathway button is clicked', () => {
    render(<HangulLesson onFinishLesson={mockFinish} />);

    const backBtn = screen.getByRole('button', { name: /Back to Pathway/i });
    fireEvent.click(backBtn);
    expect(mockFinish).toHaveBeenCalledTimes(1);
  });
});
