// Data tables and helpers for Lesson 1: Introduction to Hangul & Eumjeol Formation

export const INITIAL_CONSONANTS = [
  { char: 'ㄱ', name: 'Giyeok', rom: 'g/k', index: 0, hint: 'Looks like a Gun or Corner sound' },
  { char: 'ㄴ', name: 'Nieun', rom: 'n', index: 2, hint: 'Looks like a Nose or 90° angle' },
  { char: 'ㄷ', name: 'Digeut', rom: 'd/t', index: 3, hint: 'Looks like a Doorframe' },
  { char: 'ㄹ', name: 'Rieul', rom: 'r/l', index: 5, hint: 'Looks like a Rattlesnake / R' },
  { char: 'ㅁ', name: 'Mieum', rom: 'm', index: 6, hint: 'Looks like a Square Box / Mouth' },
  { char: 'ㅂ', name: 'Bieup', rom: 'b/p', index: 7, hint: 'Looks like a Bucket of Water' },
  { char: 'ㅅ', name: 'Siot', rom: 's', index: 9, hint: 'Looks like a Person Standing / Skirt' },
  { char: 'ㅇ', name: 'Ieung', rom: 'silent/ng', index: 11, hint: 'Silent at start, "ng" at bottom' },
  { char: 'ㅈ', name: 'Jieut', rom: 'j/ch', index: 12, hint: 'Looks like a Person with a Hat' },
  { char: 'ㅊ', name: 'Chieut', rom: 'ch', index: 14, hint: 'Jieut with an extra top stroke' },
  { char: 'ㅋ', name: 'Kieut', rom: 'k', index: 15, hint: 'Giyeok with a middle line' },
  { char: 'ㅌ', name: 'Tieut', rom: 't', index: 16, hint: 'Looks like a Capital E / Table' },
  { char: 'ㅍ', name: 'Pieut', rom: 'p', index: 17, hint: 'Looks like Roman Numeral II / Pillars' },
  { char: 'ㅎ', name: 'Hieut', rom: 'h', index: 18, hint: 'Looks like a Person wearing a Top Hat' }
];

export const MEDIAL_VOWELS = [
  { char: 'ㅏ', name: 'A', rom: 'a', type: 'vertical', index: 0 },
  { char: 'ㅑ', name: 'YA', rom: 'ya', type: 'vertical', index: 2 },
  { char: 'ㅓ', name: 'EO', rom: 'eo', type: 'vertical', index: 4 },
  { char: 'ㅕ', name: 'YEO', rom: 'yeo', type: 'vertical', index: 6 },
  { char: 'ㅗ', name: 'O', rom: 'o', type: 'horizontal', index: 8 },
  { char: 'ㅛ', name: 'YO', rom: 'yo', type: 'horizontal', index: 12 },
  { char: 'ㅜ', name: 'U', rom: 'u', type: 'horizontal', index: 13 },
  { char: 'ㅠ', name: 'YU', rom: 'yu', type: 'horizontal', index: 17 },
  { char: 'ㅡ', name: 'EU', rom: 'eu', type: 'horizontal', index: 18 },
  { char: 'ㅣ', name: 'I', rom: 'i', type: 'vertical', index: 20 }
];

export const FINAL_CONSONANTS = [
  { char: 'None (No Batchim)', name: 'None', index: 0 },
  { char: 'ㄱ', name: 'Giyeok (k)', index: 1 },
  { char: 'ㄴ', name: 'Nieun (n)', index: 4 },
  { char: 'ㄷ', name: 'Digeut (t)', index: 7 },
  { char: 'ㄹ', name: 'Rieul (l)', index: 8 },
  { char: 'ㅁ', name: 'Mieum (m)', index: 16 },
  { char: 'ㅂ', name: 'Bieup (p)', index: 17 },
  { char: 'ㅅ', name: 'Siot (t)', index: 19 },
  { char: 'ㅇ', name: 'Ieung (ng)', index: 21 }
];

// Helper formula to compose Hangul Unicode Syllable block
export function composeSyllable(initialObj, vowelObj, finalObj) {
  const initIdx = initialObj?.index || 0;
  const vowIdx = vowelObj?.index || 0;
  const finIdx = finalObj?.index || 0;
  const code = 0xAC00 + (initIdx * 588) + (vowIdx * 28) + finIdx;
  return String.fromCharCode(code);
}

// Browser TTS Speech Synthesis Helper
export function playSound(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}
