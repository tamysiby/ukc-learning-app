import React, { useState } from 'react';

export default function HangulQuizStep({ onPrev, onFinishLesson }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleQuizSelect = (qId, optionIdx) => {
    setQuizAnswers({ ...quizAnswers, [qId]: optionIdx });
  };

  const isQuizPassed = quizSubmitted && quizAnswers.q1 === 1 && quizAnswers.q2 === 0 && quizAnswers.q3 === 2;

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">task_alt</span>
          Lesson 1 Comprehension Check
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Test your knowledge of Hangul characters and syllable block rules.
        </p>
      </div>

      {/* Quiz Form */}
      <div className="space-y-6 font-body">
        {/* Question 1 */}
        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/80 space-y-3">
          <p className="text-xs font-bold text-on-surface">
            1. Which consonant is used as a silent placeholder when a syllable starts with a vowel sound?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['ㄱ (Giyeok)', 'ㅇ (Ieung)', 'ㅁ (Mieum)'].map((opt, idx) => (
              <button
                key={opt}
                onClick={() => handleQuizSelect('q1', idx)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  quizAnswers.q1 === idx
                    ? 'bg-tertiary/10 border-tertiary text-tertiary font-bold'
                    : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/80 space-y-3">
          <p className="text-xs font-bold text-on-surface">
            2. What syllable block is formed by combining initial ㄱ, medial ㅗ, and final ㅁ?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['곰 (gom)', '감 (gam)', '가 (ga)'].map((opt, idx) => (
              <button
                key={opt}
                onClick={() => handleQuizSelect('q2', idx)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  quizAnswers.q2 === idx
                    ? 'bg-tertiary/10 border-tertiary text-tertiary font-bold'
                    : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/80 space-y-3">
          <p className="text-xs font-bold text-on-surface">
            3. Where is a vertical vowel (such as ㅏ or ㅣ) placed relative to the initial consonant?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['Below the consonant', 'Above the consonant', 'To the RIGHT of the consonant'].map((opt, idx) => (
              <button
                key={opt}
                onClick={() => handleQuizSelect('q3', idx)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  quizAnswers.q3 === idx
                    ? 'bg-tertiary/10 border-tertiary text-tertiary font-bold'
                    : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Quiz Action */}
        {!quizSubmitted ? (
          <button
            onClick={() => setQuizSubmitted(true)}
            disabled={Object.keys(quizAnswers).length < 3}
            className="w-full py-3 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            Submit Answers
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {isQuizPassed ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-600">verified</span>
                <h3 className="text-base font-extrabold font-headline">Excellent Job! 100% Score! 🎉</h3>
                <p className="text-xs text-emerald-800">
                  You have mastered the basics of Hangul characters and syllable block formation!
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-amber-600">info</span>
                <h3 className="text-sm font-bold font-headline">Almost there! Review your answers</h3>
                <p className="text-xs text-amber-800">Review the character rules and try submitting again.</p>
                <button
                  onClick={() => setQuizSubmitted(false)}
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-low cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={onFinishLesson}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Complete Lesson & Return to Pathway</span>
          <span className="material-symbols-outlined text-base">check_circle</span>
        </button>
      </div>
    </div>
  );
}
