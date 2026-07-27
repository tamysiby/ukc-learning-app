import React from 'react';

const playSound = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};

const BATCHIM_GROUPS = [
  {
    sound: 'ㅂ [p]',
    letters: 'ㅂ, ㅍ, ㅄ, ㄿ',
    words: [
      { korean: '밥', rom: 'bap', eng: 'rice' },
      { korean: '무릎', rom: 'mu-reup', eng: 'knee' },
      { korean: '없다', rom: 'eop-da', eng: 'to not have' }
    ]
  },
  {
    sound: 'ㄷ [t]',
    letters: 'ㄷ, ㅅ, ㅈ, ㅊ, ㅌ, ㅎ, ㅆ',
    words: [
      { korean: '옷', rom: 'ot', eng: 'clothes' },
      { korean: '걷다', rom: 'geot-da', eng: 'to walk' },
      { korean: '맞다', rom: 'mat-da', eng: 'to be right' },
      { korean: '하얗다', rom: 'ha-yat-da', eng: 'to be white' }
    ]
  },
  {
    sound: 'ㄱ [k]',
    letters: 'ㄱ, ㅋ, ㄲ, ㄱㅅ, ㄹㄱ',
    words: [
      { korean: '목', rom: 'mok', eng: 'neck' },
      { korean: '부엌', rom: 'bu-eok', eng: 'kitchen' },
      { korean: '읽다', rom: 'ik-da', eng: 'to read' }
    ]
  },
  {
    sound: 'ㅁ [m]',
    letters: 'ㅁ, ㄹㅁ',
    words: [
      { korean: '감', rom: 'gam', eng: 'persimmon' },
      { korean: '마음', rom: 'ma-um', eng: 'mind' },
      { korean: '젊다', rom: 'jeom-da', eng: 'to be young' }
    ]
  },
  {
    sound: 'ㄴ [n]',
    letters: 'ㄴ, ㄴㅈ, ㄴㅎ',
    words: [
      { korean: '산', rom: 'san', eng: 'mountain' },
      { korean: '안다', rom: 'an-da', eng: 'to hug' },
      { korean: '앉다', rom: 'an-da', eng: 'to sit' }
    ]
  },
  {
    sound: 'ㅇ [ng]',
    letters: 'ㅇ',
    words: [
      { korean: '강', rom: 'gang', eng: 'river' },
      { korean: '방', rom: 'bang', eng: 'room' }
    ]
  },
  {
    sound: 'ㄹ [l]',
    letters: 'ㄹ, ㄹㄱ, ㄹㅁ, ㄹㅂ, ㄹㅅ, ㄹㅌ, ㄹㅍ, ㄹㅎ',
    words: [
      { korean: '발', rom: 'bal', eng: 'foot' },
      { korean: '길', rom: 'gil', eng: 'road' }
    ]
  }
];

export default function BatchimLesson({ onFinishLesson }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-5 space-y-6">
      {/* Sticky Focus Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onFinishLesson}
            className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
            title="Done"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h1 className="text-sm sm:text-base font-bold text-on-surface font-headline">
            자음 4: 받침
          </h1>
        </div>
        <button
          onClick={onFinishLesson}
          className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Syllable Block Graphic: 당근 (Carrot) */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Carrot Icon & Audio */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-4xl shrink-0">
            🥕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-on-surface font-headline">당근</span>
              <button
                onClick={() => playSound('당근')}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                title="Listen"
              >
                <span className="material-symbols-outlined text-base">volume_up</span>
              </button>
            </div>
            <span className="text-xs font-semibold text-outline">[dang-geun]</span>
          </div>
        </div>

        {/* Syllable Structure Grid Graphic */}
        <div className="flex items-center gap-3">
          {/* Syllable 1: 당 */}
          <div className="border-2 border-outline-variant/60 rounded-2xl p-2.5 text-center min-w-[90px] bg-surface-container-low">
            <div className="grid grid-cols-2 gap-1 text-sm font-extrabold text-on-surface font-headline mb-1.5">
              <div className="bg-background p-2 rounded-lg border border-outline-variant/30">ㄷ</div>
              <div className="bg-background p-2 rounded-lg border border-outline-variant/30">ㅏ</div>
            </div>
            <div className="bg-primary text-on-primary font-black text-lg p-2 rounded-xl shadow-xs">
              ㅇ
            </div>
          </div>

          <span className="text-xl font-bold text-outline">+</span>

          {/* Syllable 2: 근 */}
          <div className="border-2 border-outline-variant/60 rounded-2xl p-2.5 text-center min-w-[90px] bg-surface-container-low">
            <div className="grid grid-cols-2 gap-1 text-sm font-extrabold text-on-surface font-headline mb-1.5">
              <div className="bg-background p-2 rounded-lg border border-outline-variant/30">ㄱ</div>
              <div className="bg-background p-2 rounded-lg border border-outline-variant/30">ㅡ</div>
            </div>
            <div className="bg-primary text-on-primary font-black text-lg p-2 rounded-xl shadow-xs">
              ㄴ
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Grid of Consonant Sound Groups & Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BATCHIM_GROUPS.map((group, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-xs flex flex-col justify-between space-y-3"
          >
            {/* Header: Sound & Consonant Letters */}
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
              <span className="text-base font-extrabold text-primary font-headline">
                {group.sound}
              </span>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg">
                {group.letters}
              </span>
            </div>

            {/* Word Chips with Audio */}
            <div className="flex flex-wrap gap-2 pt-1">
              {group.words.map((w, wIdx) => (
                <button
                  key={wIdx}
                  onClick={() => playSound(w.korean)}
                  className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <span className="font-bold text-sm text-on-surface font-headline">{w.korean}</span>
                  <span className="text-[11px] text-outline">[{w.rom}]</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">({w.eng})</span>
                  <span className="material-symbols-outlined text-xs text-primary ml-0.5">volume_up</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
