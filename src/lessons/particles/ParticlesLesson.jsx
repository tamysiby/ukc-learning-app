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

// Helper component to render particles with high contrast badges
function HighlightedParticleText({ text }) {
  if (!text) return null;

  // Define exact particle pattern tokens to replace with high contrast badges
  // 1. Subject Particle (이 - 받침 O): primary blue badge
  // 2. Subject Particle (가 - 받침 X): emerald green badge
  // 3. Topic Particle (은 - 받침 O): primary blue badge
  // 4. Topic Particle (는 - 받침 X): emerald green badge
  // 5. Predicate endings (이에요, 예요, 이야, 야, 입니다, 입니까): bold underline accent

  const particleBadgeClassBatchim = "bg-primary/20 text-primary font-black px-1.5 py-0.5 rounded-md border border-primary/30 shadow-2xs mx-0.5";
  const particleBadgeClassNoBatchim = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded-md border border-emerald-500/30 shadow-2xs mx-0.5";
  const predicateBadgeClass = "font-black underline decoration-2 underline-offset-2 text-primary dark:text-primary-fixed";

  if (text === '이름이 뭐예요?') {
    return (
      <span>
        이름<span className={particleBadgeClassBatchim}>이</span> 뭐<span className={predicateBadgeClass}>예요?</span>
      </span>
    );
  }
  if (text === '이름이 뭐야?') {
    return (
      <span>
        이름<span className={particleBadgeClassBatchim}>이</span> 뭐<span className={predicateBadgeClass}>야?</span>
      </span>
    );
  }
  if (text === '이름이 무엇입니까?') {
    return (
      <span>
        이름<span className={particleBadgeClassBatchim}>이</span> 무엇<span className={predicateBadgeClass}>입니까?</span>
      </span>
    );
  }
  if (text === '저는 스테파니예요.') {
    return (
      <span>
        저<span className={particleBadgeClassNoBatchim}>는</span> 스테파니<span className={predicateBadgeClass}>예요.</span>
      </span>
    );
  }
  if (text === '나는 스테파니야.') {
    return (
      <span>
        나<span className={particleBadgeClassNoBatchim}>는</span> 스테파니<span className={predicateBadgeClass}>야.</span>
      </span>
    );
  }
  if (text === '저는 스테파니입니다.') {
    return (
      <span>
        저<span className={particleBadgeClassNoBatchim}>는</span> 스테파니<span className={predicateBadgeClass}>입니다.</span>
      </span>
    );
  }

  if (text === '직업이 뭐예요?') {
    return (
      <span>
        직업<span className={particleBadgeClassBatchim}>이</span> 뭐<span className={predicateBadgeClass}>예요?</span>
      </span>
    );
  }
  if (text === '직업이 뭐야?') {
    return (
      <span>
        직업<span className={particleBadgeClassBatchim}>이</span> 뭐<span className={predicateBadgeClass}>야?</span>
      </span>
    );
  }
  if (text === '직업이 무엇입니까?') {
    return (
      <span>
        직업<span className={particleBadgeClassBatchim}>이</span> 무엇<span className={predicateBadgeClass}>입니까?</span>
      </span>
    );
  }
  if (text === '리에 씨는 요리사예요.') {
    return (
      <span>
        리에 씨<span className={particleBadgeClassNoBatchim}>는</span> 요리사<span className={predicateBadgeClass}>예요.</span>
      </span>
    );
  }
  if (text === '리에는 요리사야.') {
    return (
      <span>
        리에<span className={particleBadgeClassNoBatchim}>는</span> 요리사<span className={predicateBadgeClass}>야.</span>
      </span>
    );
  }
  if (text === '리에 씨는 요리사입니다.') {
    return (
      <span>
        리에 씨<span className={particleBadgeClassNoBatchim}>는</span> 요리사<span className={predicateBadgeClass}>입니다.</span>
      </span>
    );
  }

  if (text === '취미가 농구예요?') {
    return (
      <span>
        취미<span className={particleBadgeClassNoBatchim}>가</span> 농구<span className={predicateBadgeClass}>예요?</span>
      </span>
    );
  }
  if (text === '취미가 농구야?') {
    return (
      <span>
        취미<span className={particleBadgeClassNoBatchim}>가</span> 농구<span className={predicateBadgeClass}>야?</span>
      </span>
    );
  }
  if (text === '취미가 농구입니까?') {
    return (
      <span>
        취미<span className={particleBadgeClassNoBatchim}>가</span> 농구<span className={predicateBadgeClass}>입니까?</span>
      </span>
    );
  }
  if (text === '아니요, 취미는 야구예요.') {
    return (
      <span>
        아니요, 취미<span className={particleBadgeClassNoBatchim}>는</span> 야구<span className={predicateBadgeClass}>예요.</span>
      </span>
    );
  }
  if (text === '아니, 취미는 야구야.') {
    return (
      <span>
        아니, 취미<span className={particleBadgeClassNoBatchim}>는</span> 야구<span className={predicateBadgeClass}>야.</span>
      </span>
    );
  }
  if (text === '아니요, 취미는 야구입니다.') {
    return (
      <span>
        아니요, 취미<span className={particleBadgeClassNoBatchim}>는</span> 야구<span className={predicateBadgeClass}>입니다.</span>
      </span>
    );
  }

  if (text === '선생님이 한국 사람이에요?') {
    return (
      <span>
        선생님<span className={particleBadgeClassBatchim}>이</span> 한국 사람<span className={predicateBadgeClass}>이에요?</span>
      </span>
    );
  }
  if (text === '선생님이 한국 사람이야?') {
    return (
      <span>
        선생님<span className={particleBadgeClassBatchim}>이</span> 한국 사람<span className={predicateBadgeClass}>이야?</span>
      </span>
    );
  }
  if (text === '선생님이 한국 사람입니까?') {
    return (
      <span>
        선생님<span className={particleBadgeClassBatchim}>이</span> 한국 사람<span className={predicateBadgeClass}>입니까?</span>
      </span>
    );
  }
  if (text === '네, 선생님은 한국 사람이에요.') {
    return (
      <span>
        네, 선생님<span className={particleBadgeClassBatchim}>은</span> 한국 사람<span className={predicateBadgeClass}>이에요.</span>
      </span>
    );
  }
  if (text === '응, 선생님은 한국 사람이야.') {
    return (
      <span>
        응, 선생님<span className={particleBadgeClassBatchim}>은</span> 한국 사람<span className={predicateBadgeClass}>이야.</span>
      </span>
    );
  }
  if (text === '네, 선생님은 한국 사람입니다.') {
    return (
      <span>
        네, 선생님<span className={particleBadgeClassBatchim}>은</span> 한국 사람<span className={predicateBadgeClass}>입니다.</span>
      </span>
    );
  }

  return <span>{text}</span>;
}

const CONVERSATIONS = [
  {
    type: '이름',
    batchim: true,
    batchimChar: 'ㅁ',
    noun: '이름',
    english: 'name',
    svg: '/illustrations/vp2-16.svg',
    informalQ: '이름이 뭐예요?',
    informalA: '저는 스테파니예요.',
    casualQ: '이름이 뭐야?',
    casualA: '나는 스테파니야.',
    formalQ: '이름이 무엇입니까?',
    formalA: '저는 스테파니입니다.'
  },
  {
    type: '직업',
    batchim: true,
    batchimChar: 'ㅂ',
    noun: '직업',
    english: 'occupation',
    svg: '/illustrations/occ-10.svg',
    informalQ: '직업이 뭐예요?',
    informalA: '리에 씨는 요리사예요.',
    casualQ: '직업이 뭐야?',
    casualA: '리에는 요리사야.',
    formalQ: '직업이 무엇입니까?',
    formalA: '리에 씨는 요리사입니다.'
  },
  {
    type: '취미',
    batchim: false,
    batchimChar: null,
    noun: '취미',
    english: 'hobby',
    svg: '/illustrations/hob-2.svg',
    informalQ: '취미가 농구예요?',
    informalA: '아니요, 취미는 야구예요.',
    casualQ: '취미가 농구야?',
    casualA: '아니, 취미는 야구야.',
    formalQ: '취미가 농구입니까?',
    formalA: '아니요, 취미는 야구입니다.'
  },
  {
    type: '선생님',
    batchim: true,
    batchimChar: 'ㅁ',
    noun: '선생님',
    english: 'teacher',
    svg: '/illustrations/vp2-16.svg',
    informalQ: '선생님이 한국 사람이에요?',
    informalA: '네, 선생님은 한국 사람이에요.',
    casualQ: '선생님이 한국 사람이야?',
    casualA: '응, 선생님은 한국 사람이야.',
    formalQ: '선생님이 한국 사람입니까?',
    formalA: '네, 선생님은 한국 사람입니다.'
  }
];

export default function ParticlesLesson({ onFinishLesson }) {
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
          <h1 className="hidden sm:block text-sm sm:text-base font-bold text-on-surface font-headline truncate">
            N이/가 N예요/이에요? · N은/는 N예요/이에요.
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

      {/* Visual Rule Graphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Particles Rule: 이 / 가 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-primary/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold font-headline">
              Subject Particle (주격 조사)
            </span>
            <span className="text-xs font-semibold text-outline">
              이 / 가
            </span>
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-center gap-2 text-lg font-black text-on-surface font-headline">
              <span className="text-xs font-bold text-outline uppercase font-headline mr-1">받침 O:</span>
              <span className="bg-surface-container px-2.5 py-1 rounded-xl">이름</span>
              <span className="text-primary font-bold">+</span>
              <span className="bg-primary/20 text-primary font-black px-2.5 py-1 rounded-xl border border-primary/40 shadow-xs">이</span>
              <span className="text-outline font-bold font-headline">=</span>
              <span className="text-primary font-extrabold underline decoration-2 underline-offset-4">이름<span className="bg-primary/20 text-primary font-black px-1.5 py-0.5 rounded-md border border-primary/30 shadow-2xs ml-0.5">이</span></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg font-black text-on-surface font-headline">
              <span className="text-xs font-bold text-outline uppercase font-headline mr-1">받침 X:</span>
              <span className="bg-surface-container px-2.5 py-1 rounded-xl">취미</span>
              <span className="text-emerald-700 font-bold">+</span>
              <span className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-xs">가</span>
              <span className="text-outline font-bold font-headline">=</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold underline decoration-2 underline-offset-4">취미<span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded-md border border-emerald-500/30 shadow-2xs ml-0.5">가</span></span>
            </div>
          </div>
        </div>

        {/* Topic Particles Rule: 은 / 는 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-emerald-500/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold font-headline">
              Topic Particle (보조사)
            </span>
            <span className="text-xs font-semibold text-outline">
              은 / 는
            </span>
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-center gap-2 text-lg font-black text-on-surface font-headline">
              <span className="text-xs font-bold text-outline uppercase font-headline mr-1">받침 O:</span>
              <span className="bg-surface-container px-2.5 py-1 rounded-xl">선생님</span>
              <span className="text-primary font-bold">+</span>
              <span className="bg-primary/20 text-primary font-black px-2.5 py-1 rounded-xl border border-primary/40 shadow-xs">은</span>
              <span className="text-outline font-bold font-headline">=</span>
              <span className="text-primary font-extrabold underline decoration-2 underline-offset-4">선생님<span className="bg-primary/20 text-primary font-black px-1.5 py-0.5 rounded-md border border-primary/30 shadow-2xs ml-0.5">은</span></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg font-black text-on-surface font-headline">
              <span className="text-xs font-bold text-outline uppercase font-headline mr-1">받침 X:</span>
              <span className="bg-surface-container px-2.5 py-1 rounded-xl">취미</span>
              <span className="text-emerald-700 font-bold">+</span>
              <span className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-xs">는</span>
              <span className="text-outline font-bold font-headline">=</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold underline decoration-2 underline-offset-4">취미<span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded-md border border-emerald-500/30 shadow-2xs ml-0.5">는</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations Grid */}
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
                {/* Status Badges */}
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
                    <span className="text-sm font-bold text-on-surface font-headline flex items-center">
                      <HighlightedParticleText text={question} />
                    </span>
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
                    <span className="text-base font-extrabold text-on-surface font-headline flex items-center">
                      <HighlightedParticleText text={answer} />
                    </span>
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
