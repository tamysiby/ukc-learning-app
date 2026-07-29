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

const PRONUNCIATION_RULES = {
  liaison: {
    id: 'liaison',
    title: '1. 연음 법칙 (Liaison)',
    badge: '연음',
    subtitle: '받침 + ㅇ → 연음 발음',
    equationLeft: '받침 (ㄱ,ㄷ,ㅂ...)',
    equationPlus: '+',
    equationMid: 'ㅇ',
    equationResult: '받침소리 연결',
    examples: [
      { word: '이것은', pronunciation: '이거슨', note: 'ㅅ + 은 → 거슨', svg: '/illustrations/vp2-4.svg', english: 'this' },
      { word: '선생님이고', pronunciation: '선생님이고', note: 'ㅁ + 이 → 미고', svg: '/illustrations/vp2-16.svg', english: 'is a teacher' },
      { word: '읽으세요', pronunciation: '일그세요', note: 'ㄺ + 으 → 일그', svg: '/illustrations/cr-3.svg', english: 'please read' },
      { word: '밥을', pronunciation: '바블', note: 'ㅂ + 을 → 바블', svg: '/illustrations/bat-1.svg', english: 'rice (obj)' },
      { word: '꽃이', pronunciation: '꼬치', note: 'ㅊ + 이 → 꼬치', svg: '/illustrations/vp1-20.svg', english: 'flower (subj)' },
      { word: '먹어요', pronunciation: '머거요', note: 'ㄱ + 어 → 머거', svg: '/illustrations/vp2-12.svg', english: 'eat' },
      { word: '있어요', pronunciation: '이써요', note: 'ㅆ + 어 → 이써', svg: '/illustrations/eyo-1.svg', english: 'there is' },
      { word: '같아요', pronunciation: '가타요', note: 'ㅌ + 아 → 가타', svg: '/illustrations/cr-16.svg', english: 'same' }
    ]
  },
  aspiration: {
    id: 'aspiration',
    title: '2. 격음화 (Aspiration)',
    badge: '격음화',
    subtitle: 'ㄱ,ㄷ,ㅂ,ㅈ + ㅎ → ㅋ,ㅌ,ㅍ,ㅊ',
    equationLeft: 'ㄱ, ㄷ, ㅂ, ㅈ',
    equationPlus: '+',
    equationMid: 'ㅎ',
    equationResult: 'ㅋ, ㅌ, ㅍ, ㅊ',
    examples: [
      { word: '축하', pronunciation: '추카', note: 'ㄱ + 하 → 카', svg: '/illustrations/cr-20.svg', english: 'congratulations' },
      { word: '백화점', pronunciation: '배콰점', note: 'ㄱ + 화 → 콰', svg: '/illustrations/vp2-19.svg', english: 'department store' },
      { word: '못해요', pronunciation: '모태요', note: 'ㅅ(ㄷ) + 해 → 태', svg: '/illustrations/cr-15.svg', english: 'cannot do' },
      { word: '입하면', pronunciation: '이파면', note: 'ㅂ + 하면 → 파', svg: '/illustrations/vp2-1.svg', english: 'if entered' },
      { word: '맞히다', pronunciation: '마치다', note: 'ㅈ + 히 → 치', svg: '/illustrations/cr-8.svg', english: 'guess right' },
      { word: '좋고', pronunciation: '조코', note: 'ㅎ + 고 → 코', svg: '/illustrations/cr-19.svg', english: 'good and' },
      { word: '좋다', pronunciation: '조타', note: 'ㅎ + 다 → 타', svg: '/illustrations/cr-19.svg', english: 'is good' },
      { word: '많지', pronunciation: '만치', note: 'ㅎ + 지 → 치', svg: '/illustrations/eyo-1.svg', english: 'many right' }
    ]
  },
  nasalization: {
    id: 'nasalization',
    title: '3. 비음화 (Nasalization)',
    badge: '비음화',
    subtitle: 'ㄱ,ㄷ,ㅂ + ㄴ,ㅁ → ㅇ,ㄴ,ㅁ',
    equationLeft: 'ㄱ, ㄷ, ㅂ',
    equationPlus: '+',
    equationMid: 'ㄴ, ㅁ',
    equationResult: 'ㅇ, ㄴ, ㅁ',
    examples: [
      { word: '국물', pronunciation: '궁물', note: 'ㄱ + ㅁ → 궁', svg: '/illustrations/vp2-8.svg', english: 'soup broth' },
      { word: '백 명', pronunciation: '뱅 명', note: 'ㄱ + ㅁ → 뱅', svg: '/illustrations/vp2-16.svg', english: '100 people' },
      { word: '듣는', pronunciation: '든는', note: 'ㄷ + ㄴ → 든', svg: '/illustrations/cr-2.svg', english: 'listening' },
      { word: '옷만', pronunciation: '온만', note: 'ㅅ(ㄷ) + ㅁ → 온', svg: '/illustrations/vp1-28.svg', english: 'only clothes' },
      { word: '감사합니다', pronunciation: '감사함니다', note: 'ㅂ + 니 → 함', svg: '/illustrations/cr-21.svg', english: 'thank you' },
      { word: '앞마당', pronunciation: '암마당', note: 'ㅍ(ㅂ) + ㅁ → 암', svg: '/illustrations/vp2-19.svg', english: 'front yard' },
      { word: '독립', pronunciation: '동닙', note: 'ㄱ + ㄹ → 동닙', svg: '/illustrations/vp2-19.svg', english: 'independence' },
      { word: '십 리', pronunciation: '심니', note: 'ㅂ + ㄹ → 심니', svg: '/illustrations/vp1-5.svg', english: '10 ri (distance)' }
    ]
  },
  palatalization: {
    id: 'palatalization',
    title: '4. 구개음화 (Palatalization)',
    badge: '구개음화',
    subtitle: 'ㄷ,ㅌ + 이/히 → 지,치',
    equationLeft: 'ㄷ, ㅌ',
    equationPlus: '+',
    equationMid: '이 / 히',
    equationResult: '지 / 치',
    examples: [
      { word: '같이', pronunciation: '가치', note: 'ㅌ + 이 → 치', svg: '/illustrations/cr-16.svg', english: 'together' },
      { word: '굳이', pronunciation: '구지', note: 'ㄷ + 이 → 지', svg: '/illustrations/eyo-1.svg', english: 'persistently' },
      { word: '미닫이', pronunciation: '미다지', note: 'ㄷ + 이 → 지', svg: '/illustrations/ui-ja.svg', english: 'sliding door' },
      { word: '밭이', pronunciation: '바치', note: 'ㅌ + 이 → 치', svg: '/illustrations/dang-geun.svg', english: 'field (subj)' },
      { word: '붙이다', pronunciation: '부치다', note: 'ㅌ + 이 → 치', svg: '/illustrations/ri-bon.svg', english: 'to stick/attach' },
      { word: '닫히다', pronunciation: '다치다', note: 'ㄷ + 히 → 치', svg: '/illustrations/gyo-sil.svg', english: 'to be closed' }
    ]
  },
  glottalization: {
    id: 'glottalization',
    title: '5. 된소리화 (Tensification)',
    badge: '된소리화',
    subtitle: 'ㄱ,ㄷ,ㅂ + ㄱ,ㄷ,ㅂ,ㅅ,ㅈ → ㄲ,ㄸ,ㅃ,ㅆ,ㅉ',
    equationLeft: 'ㄱ, ㄷ, ㅂ',
    equationPlus: '+',
    equationMid: 'ㄱ,ㄷ,ㅂ,ㅅ,ㅈ',
    equationResult: 'ㄲ, ㄸ, ㅃ, ㅆ, ㅉ',
    examples: [
      { word: '학교', pronunciation: '학교 → [학꾜]', note: 'ㄱ + ㄱ → 꾜', svg: '/illustrations/vp2-19.svg', english: 'school' },
      { word: '있다', pronunciation: '있따', note: 'ㅆ(ㄷ) + 다 → 따', svg: '/illustrations/cr-9.svg', english: 'exist / have' },
      { word: '떡볶이', pronunciation: '떡뽀끼', note: 'ㄱ + ㅂ → 뽀, ㄲ + 이 → 끼', svg: '/illustrations/gim-bap.svg', english: 'tteokbokki' },
      { word: '첫사랑', pronunciation: '첫싸랑', note: 'ㅅ(ㄷ) + 사 → 싸', svg: '/illustrations/na-bi.svg', english: 'first love' },
      { word: '갑자기', pronunciation: '갑짜기', note: 'ㅂ + 자 → 짜', svg: '/illustrations/ju-sa-wi.svg', english: 'suddenly' }
    ]
  }
};

export default function PronunciationRulesLesson({ onFinishLesson }) {
  const [activeRuleKey, setActiveRuleKey] = useState('liaison'); // 'liaison' | 'aspiration' | 'nasalization' | 'palatalization' | 'glottalization'
  const activeRule = PRONUNCIATION_RULES[activeRuleKey];

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-5 space-y-6">
      {/* Sticky Header & Control Bar */}
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
            한국어 발음 규칙 (Korean Pronunciation Rules)
          </h1>
        </div>

        <button
          onClick={onFinishLesson}
          className="px-4 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant text-xs font-bold transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Rule Category Selector Nav Pills */}
      <div className="bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveRuleKey('liaison')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeRuleKey === 'liaison'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          1. 연음 (Liaison)
        </button>

        <button
          onClick={() => setActiveRuleKey('aspiration')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeRuleKey === 'aspiration'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          2. 격음화 (Aspiration)
        </button>

        <button
          onClick={() => setActiveRuleKey('nasalization')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeRuleKey === 'nasalization'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          3. 비음화 (Nasalization)
        </button>

        <button
          onClick={() => setActiveRuleKey('palatalization')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeRuleKey === 'palatalization'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          4. 구개음화 (Palatalization)
        </button>

        <button
          onClick={() => setActiveRuleKey('glottalization')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeRuleKey === 'glottalization'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          5. 된소리화 (Glottalization)
        </button>
      </div>

      {/* Visual Rule Graphic Card (Equation) */}
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border-2 border-primary/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold font-headline">
            {activeRule.badge}
          </span>
          <span className="text-xs font-semibold text-outline font-headline">
            {activeRule.subtitle}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl font-black text-on-surface font-headline py-2 flex-wrap">
          <span className="bg-surface-container px-3.5 py-1.5 rounded-xl border border-outline-variant/60">
            {activeRule.equationLeft}
          </span>
          <span className="text-primary font-bold">{activeRule.equationPlus}</span>
          <span className="bg-primary/15 text-primary px-3.5 py-1.5 rounded-xl border border-primary/30">
            {activeRule.equationMid}
          </span>
          <span className="text-outline font-bold font-headline">=</span>
          <span className="text-primary underline decoration-2 underline-offset-4 bg-primary/10 px-3.5 py-1.5 rounded-xl">
            {activeRule.equationResult}
          </span>
        </div>
      </div>

      {/* Interactive Example Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRule.examples.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant shadow-xs flex items-center gap-4 hover:border-primary/40 transition-colors"
          >
            {/* Illustration SVG */}
            <div className="w-24 h-24 rounded-2xl bg-surface-container-low p-2 border border-outline-variant/60 flex items-center justify-center shrink-0">
              <img
                src={item.svg}
                alt={item.word}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Word & Pronunciation Details */}
            <div className="flex-1 space-y-2.5 min-w-0">
              {/* Badge & Note */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">
                  {item.note}
                </span>
                <span className="text-[11px] font-semibold text-outline font-headline truncate">
                  {item.english}
                </span>
              </div>

              {/* Written Word Bubble (글자) */}
              <div className="flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-outline uppercase font-headline">글자:</span>
                  <span className="text-base font-bold text-on-surface font-headline">{item.word}</span>
                </div>
                <button
                  onClick={() => playSound(item.word)}
                  className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer shrink-0"
                  title="Listen Written Word"
                >
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                </button>
              </div>

              {/* Spoken Pronunciation Bubble [발음] */}
              <div className="flex items-center justify-between bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase font-headline">발음:</span>
                  <span className="text-base font-black text-emerald-800 dark:text-emerald-300 font-headline">
                    [{item.pronunciation}]
                  </span>
                </div>
                <button
                  onClick={() => playSound(item.pronunciation)}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0"
                  title="Listen Pronunciation"
                >
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
