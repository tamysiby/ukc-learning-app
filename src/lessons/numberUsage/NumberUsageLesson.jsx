import React, { useState } from 'react';

const playSound = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};

const EXAMPLES = [
  {
    category: '시간 (Time)',
    sinoVsNative: '고유어(시) + 한자어(분)',
    isNativeHeavy: true,
    noun: '시계',
    english: 'time (3:30)',
    svg: '/illustrations/vp1-5.svg',
    politeQ: '지금 몇 시예요?',
    politeA: '세 시 삼십 분이에요',
    casualQ: '지금 몇 시야?',
    casualA: '세 시 삼십 분이야',
    formalQ: '지금 몇 시입니까?',
    formalA: '세 시 삼십 분입니다'
  },
  {
    category: '나이 (Age)',
    sinoVsNative: '고유어 (나이)',
    isNativeHeavy: true,
    noun: '친구',
    english: 'age (20)',
    svg: '/illustrations/vp2-16.svg',
    politeQ: '몇 살이에요?',
    politeA: '스무 살이에요',
    casualQ: '몇 살이야?',
    casualA: '스무 살이야',
    formalQ: '몇 살입니까?',
    formalA: '스무 살입니다'
  },
  {
    category: '돈 (Money)',
    sinoVsNative: '한자어 (돈)',
    isNativeHeavy: false,
    noun: '돈',
    english: 'price (1,500 won)',
    svg: '/illustrations/vp2-4.svg',
    politeQ: '이거 얼마예요?',
    politeA: '천 오백 원이에요',
    casualQ: '이거 얼마야?',
    casualA: '천 오백 원이야',
    formalQ: '이거 얼마입니까?',
    formalA: '천 오백 원입니다'
  },
  {
    category: '개수 (Count)',
    sinoVsNative: '고유어 (개수)',
    isNativeHeavy: true,
    noun: '사과',
    english: 'items (2 apples)',
    svg: '/illustrations/vp1-20.svg',
    politeQ: '사과 몇 개 있어요?',
    politeA: '두 개 있어요',
    casualQ: '사과 몇 개 있어?',
    casualA: '두 개 있어',
    formalQ: '사과 몇 개 있습니까?',
    formalA: '두 개 있습니다'
  },
  {
    category: '날짜 (Date)',
    sinoVsNative: '한자어 (날짜)',
    isNativeHeavy: false,
    noun: '달력',
    english: 'date (july 3)',
    svg: '/illustrations/vp1-5.svg',
    politeQ: '오늘 몇 월 며칠이에요?',
    politeA: '칠월 삼일이에요',
    casualQ: '오늘 몇 월 며칠이야?',
    casualA: '칠월 삼일이야',
    formalQ: '오늘 몇 월 며칠입니까?',
    formalA: '칠월 삼일입니다'
  },
  {
    category: '사람 (People)',
    sinoVsNative: '고유어 (사람)',
    isNativeHeavy: true,
    noun: '사람',
    english: 'people (4 people)',
    svg: '/illustrations/vp2-16.svg',
    politeQ: '몇 명이에요?',
    politeA: '네 명이에요',
    casualQ: '몇 명이야?',
    casualA: '네 명이야',
    formalQ: '몇 명입니까?',
    formalA: '네 명입니다'
  }
];

export default function NumberUsageLesson({ onFinishLesson }) {
  const [speechMode, setSpeechMode] = useState('polite'); // 'casual' | 'polite' | 'formal'

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-5 space-y-6">
      {/* Sticky Header */}
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
            숫자 사용법 (Sino vs. Native Numbers)
          </h1>
        </div>

        {/* Speech Mode Switcher Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant flex items-center gap-1">
            <button
              onClick={() => setSpeechMode('casual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'casual'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Casual
            </button>
            <button
              onClick={() => setSpeechMode('polite')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'polite'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Polite
            </button>
            <button
              onClick={() => setSpeechMode('formal')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'formal'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Formal
            </button>
          </div>

          <button
            onClick={onFinishLesson}
            className="px-4 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Visual Grammar Equations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sino Korean Numbers Rule */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-primary/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold font-headline">
              한자어 (Sino)
            </span>
            <span className="text-xs font-semibold text-outline">
              날짜 / 돈 / 분 / 초 / 전화번호
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-black text-on-surface font-headline py-1">
            <span className="bg-surface-container px-3 py-1.5 rounded-xl">돈·날짜</span>
            <span className="text-primary font-bold">+</span>
            <span className="bg-primary/15 text-primary px-3 py-1.5 rounded-xl border border-primary/30">
              한자어
            </span>
            <span className="text-outline font-bold font-headline">=</span>
            <span className="text-primary underline decoration-2 underline-offset-4">
              천 원 / 칠 월
            </span>
          </div>
        </div>

        {/* Native Korean Numbers Rule */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-emerald-500/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold font-headline">
              고유어 (Native)
            </span>
            <span className="text-xs font-semibold text-outline">
              개수 / 나이 / 시(시간) / 사람
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-black text-on-surface font-headline py-1">
            <span className="bg-surface-container px-3 py-1.5 rounded-xl">개수·나이</span>
            <span className="text-emerald-700 font-bold">+</span>
            <span className="bg-emerald-500/15 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              고유어
            </span>
            <span className="text-outline font-bold font-headline">=</span>
            <span className="text-emerald-700 underline decoration-2 underline-offset-4">
              두 개 / 스무 살
            </span>
          </div>
        </div>
      </div>

      {/* 6 Conversation Example Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLES.map((item, idx) => {
          const question = speechMode === 'polite' ? item.politeQ : speechMode === 'casual' ? item.casualQ : item.formalQ;
          const answer = speechMode === 'polite' ? item.politeA : speechMode === 'casual' ? item.casualA : item.formalA;

          return (
            <div
              key={idx}
              className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant shadow-xs flex items-center gap-4"
            >
              {/* Illustration SVG */}
              <div className="w-24 h-24 rounded-2xl bg-surface-container-low p-2 border border-outline-variant/60 flex items-center justify-center shrink-0">
                <img
                  src={item.svg}
                  alt={item.noun}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Question & Answer Bubbles */}
              <div className="flex-1 space-y-2.5">
                {/* Number Type Badge & English Label */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      item.isNativeHeavy
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.sinoVsNative}
                  </span>
                  <span className="text-[11px] font-semibold text-outline font-headline">
                    {item.english}
                  </span>
                </div>

                {/* Question Bubble */}
                <div className="flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-outline uppercase font-headline">Q:</span>
                    <span className="text-sm font-bold text-on-surface font-headline">{question}</span>
                  </div>
                  <button
                    onClick={() => playSound(question)}
                    className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                    title="Listen Question"
                  >
                    <span className="material-symbols-outlined text-xs">volume_up</span>
                  </button>
                </div>

                {/* Answer Bubble */}
                <div className="flex items-center justify-between bg-primary-fixed/30 px-3 py-1.5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-primary uppercase font-headline">A:</span>
                    <span className="text-base font-extrabold text-on-surface font-headline">{answer}</span>
                  </div>
                  <button
                    onClick={() => playSound(answer)}
                    className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    title="Listen Answer"
                  >
                    <span className="material-symbols-outlined text-xs">volume_up</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
