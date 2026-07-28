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

const CONVERSATIONS = [
  {
    type: '뭐',
    batchim: true,
    batchimChar: 'ㅇ',
    noun: '가방',
    english: 'bag',
    svg: '/illustrations/vp2-1.svg',
    informalQ: '뭐예요?',
    informalA: '가방이에요',
    casualQ: '뭐야?',
    casualA: '가방이야',
    formalQ: '무엇입니까?',
    formalA: '가방입니다'
  },
  {
    type: '뭐',
    batchim: false,
    batchimChar: null,
    noun: '의자',
    english: 'chair',
    svg: '/illustrations/vp1-30.svg',
    informalQ: '뭐예요?',
    informalA: '의자예요',
    casualQ: '뭐야?',
    casualA: '의자야',
    formalQ: '무엇입니까?',
    formalA: '의자입니다'
  },
  {
    type: '누구',
    batchim: true,
    batchimChar: 'ㅁ',
    noun: '선생님',
    english: 'teacher',
    svg: '/illustrations/vp2-16.svg',
    informalQ: '누구예요?',
    informalA: '선생님이에요',
    casualQ: '누구야?',
    casualA: '선생님이야',
    formalQ: '누구입니까?',
    formalA: '선생님입니다'
  },
  {
    type: '누구',
    batchim: false,
    batchimChar: null,
    noun: '의사',
    english: 'doctor',
    svg: '/illustrations/vp1-26.svg',
    informalQ: '누구예요?',
    informalA: '의사예요',
    casualQ: '누구야?',
    casualA: '의사야',
    formalQ: '누구입니까?',
    formalA: '의사입니다'
  },
  {
    type: '어디',
    batchim: true,
    batchimChar: 'ㄹ',
    noun: '교실',
    english: 'classroom',
    svg: '/illustrations/vp2-2.svg',
    informalQ: '어디예요?',
    informalA: '교실이에요',
    casualQ: '어디야?',
    casualA: '교실이야',
    formalQ: '어디입니까?',
    formalA: '교실입니다'
  },
  {
    type: '어디',
    batchim: false,
    batchimChar: null,
    noun: '학교',
    english: 'school',
    svg: '/illustrations/vp2-19.svg',
    informalQ: '어디예요?',
    informalA: '학교예요',
    casualQ: '어디야?',
    casualA: '학교야',
    formalQ: '어디입니까?',
    formalA: '학교입니다'
  }
];

export default function EyoLesson({ onFinishLesson }) {
  const [speechMode, setSpeechMode] = useState('polite'); // 'polite' (해요체: 이에요/예요) | 'casual' (해체: 이야/야) | 'formal' (하십시오체: 입니다/입니까?)

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
            입니다 / 이에요·예요 / 이야·야
          </h1>
        </div>

        {/* Speech Mode Switcher Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant flex items-center gap-1">
            <button
              onClick={() => setSpeechMode('polite')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'polite'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              해요체 (이에요/예요)
            </button>
            <button
              onClick={() => setSpeechMode('casual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'casual'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              해체 (이야/야)
            </button>
            <button
              onClick={() => setSpeechMode('formal')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                speechMode === 'formal'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              하십시오체 (입니다)
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

      {/* Visual Rule Graphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1: 받침 O */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-primary/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold font-headline">
              받침 O
            </span>
            <span className="text-xs font-semibold text-outline">
              {speechMode === 'polite' ? '해요체' : speechMode === 'casual' ? '해체' : '하십시오체'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xl font-black text-on-surface font-headline py-1">
            <span className="bg-surface-container px-3 py-1.5 rounded-xl">가방</span>
            <span className="text-primary font-bold">+</span>
            <span className="bg-primary/15 text-primary px-3 py-1.5 rounded-xl border border-primary/30">
              {speechMode === 'polite' ? '이에요' : speechMode === 'casual' ? '이야' : '입니다'}
            </span>
            <span className="text-outline font-bold font-headline">=</span>
            <span className="text-primary underline decoration-2 underline-offset-4">
              {speechMode === 'polite' ? '가방이에요' : speechMode === 'casual' ? '가방이야' : '가방입니다'}
            </span>
          </div>
        </div>

        {/* Rule 2: 받침 X */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-emerald-500/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold font-headline">
              받침 X
            </span>
            <span className="text-xs font-semibold text-outline">
              {speechMode === 'polite' ? '해요체' : speechMode === 'casual' ? '해체' : '하십시오체'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xl font-black text-on-surface font-headline py-1">
            <span className="bg-surface-container px-3 py-1.5 rounded-xl">의자</span>
            <span className="text-emerald-700 font-bold">+</span>
            <span className="bg-emerald-500/15 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              {speechMode === 'polite' ? '예요' : speechMode === 'casual' ? '야' : '입니다'}
            </span>
            <span className="text-outline font-bold font-headline">=</span>
            <span className="text-emerald-700 underline decoration-2 underline-offset-4">
              {speechMode === 'polite' ? '의자예요' : speechMode === 'casual' ? '의자야' : '의자입니다'}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Conversation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONVERSATIONS.map((item, idx) => {
          const question = speechMode === 'polite' ? item.informalQ : speechMode === 'casual' ? item.casualQ : item.formalQ;
          const answer = speechMode === 'polite' ? item.informalA : speechMode === 'casual' ? item.casualA : item.formalA;

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
                {/* Batchim Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      item.batchim
                        ? 'bg-primary/10 text-primary'
                        : 'bg-emerald-500/10 text-emerald-700'
                    }`}
                  >
                    {item.batchim ? `받침 O (${item.batchimChar})` : '받침 X'}
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
