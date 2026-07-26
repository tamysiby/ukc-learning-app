import React from 'react';
import Hangul from 'hangul-js';

export default function KoreanKeypad({ value = '', onChange, onEnter }) {
  // Standard 2-Set (2벌식) Korean Keyboard Layout
  const row1 = ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'];
  const row2 = ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'];
  const row3 = ['ㅋ', 'ㅌ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'];

  const handleKeyPress = (jamo) => {
    const currentJamos = Hangul.disassemble(value);
    const updatedJamos = [...currentJamos, jamo];
    const assembledString = Hangul.assemble(updatedJamos);
    onChange(assembledString);
  };

  const handleBackspace = () => {
    const currentJamos = Hangul.disassemble(value);
    if (currentJamos.length === 0) return;
    currentJamos.pop();
    const assembledString = Hangul.assemble(currentJamos);
    onChange(assembledString);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleSpace = () => {
    onChange(value + ' ');
  };

  return (
    <div className="bg-surface-container-low p-3 sm:p-4 rounded-3xl border border-outline-variant/80 space-y-2 select-none font-headline shadow-md animate-in fade-in">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
          On-Screen Korean Keypad (한글 키보드)
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded-lg cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Row 1 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {row1.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[40px] h-10 sm:h-11 bg-surface-container-lowest hover:bg-primary/10 active:bg-primary/20 text-on-surface font-bold text-base sm:text-lg rounded-xl border border-outline-variant transition-all flex items-center justify-center shadow-xs cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 px-3">
        {row2.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[40px] h-10 sm:h-11 bg-surface-container-lowest hover:bg-primary/10 active:bg-primary/20 text-on-surface font-bold text-base sm:text-lg rounded-xl border border-outline-variant transition-all flex items-center justify-center shadow-xs cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 + Backspace */}
      <div className="flex justify-center items-center gap-1 sm:gap-1.5">
        {row3.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => handleKeyPress(char)}
            className="flex-1 max-w-[40px] h-10 sm:h-11 bg-surface-container-lowest hover:bg-primary/10 active:bg-primary/20 text-on-surface font-bold text-base sm:text-lg rounded-xl border border-outline-variant transition-all flex items-center justify-center shadow-xs cursor-pointer"
          >
            {char}
          </button>
        ))}

        <button
          type="button"
          onClick={handleBackspace}
          className="px-3 h-10 sm:h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm rounded-xl border border-outline-variant flex items-center justify-center cursor-pointer min-w-[50px]"
          title="Backspace"
        >
          <span className="material-symbols-outlined text-lg">backspace</span>
        </button>
      </div>

      {/* Space & Submit / Enter bar */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleSpace}
          className="flex-1 h-9 bg-surface-container-lowest hover:bg-surface-container text-outline font-bold text-xs rounded-xl border border-outline-variant cursor-pointer"
        >
          Space
        </button>
      </div>
    </div>
  );
}
