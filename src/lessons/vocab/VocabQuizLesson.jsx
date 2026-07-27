import React, { useState } from 'react';
import KoreanKeypad from '../../components/KoreanKeypad';
import VocabIllustration, { hasVocabIllustration } from '../../components/VocabIllustration';

export default function VocabQuizLesson({ quizQuestions = [], title = 'Vocab Quiz', onFinishQuiz, onExitQuiz }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isFailed, setIsFailed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Question specific states
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]); // Array of matched IDs
  const [answerFeedback, setAnswerFeedback] = useState(null); // { isCorrect: boolean }
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [typedInput, setTypedInput] = useState('');

  const currentQ = quizQuestions[currentIndex] || quizQuestions[0];

  const deductLife = () => {
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setIsFailed(true);
      }
      return Math.max(0, nextLives);
    });
  };

  const handleTryAgain = () => {
    setLives(3);
    setIsFailed(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setAnswerFeedback(null);
    setSelectedOption(null);
    setSelectedBlocks([]);
    setTypedInput('');
  };

  if (!currentQ || quizQuestions.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-4">
        <p className="text-sm text-outline">No quiz questions generated.</p>
        <button onClick={onExitQuiz} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs">
          Return to Pathway
        </button>
      </div>
    );
  }

  // --- Handlers for Matching Questions ---
  const handleLeftClick = (item) => {
    if (matchedPairs.includes(item.id)) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (matchedPairs.includes(item.id)) return;
    if (!selectedLeft) return;

    if (selectedLeft.id === item.id) {
      // Correct Match!
      const newMatched = [...matchedPairs, item.id];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);

      // If all items matched for this question
      if (newMatched.length === currentQ.pairs.length) {
        setAnswerFeedback({ isCorrect: true });
      }
    } else {
      // Incorrect Match - deduct a heart
      deductLife();
      setSelectedLeft(null);
    }
  };

  // --- Handler for Multiple Choice ---
  const handleSelectOption = (option) => {
    if (answerFeedback) return;
    setSelectedOption(option.text);
    if (option.isCorrect) {
      setAnswerFeedback({ isCorrect: true });
      setScore(prev => prev + 1);
    } else {
      setAnswerFeedback({ isCorrect: false });
      deductLife();
    }
  };

  // --- Handler for Syllable Blocks ---
  const handleAddBlock = (block) => {
    if (answerFeedback) return;
    setSelectedBlocks(prev => [...prev, block]);
  };

  const handleClearBlocks = () => {
    if (answerFeedback) return;
    setSelectedBlocks([]);
  };

  const handleCheckBlocksAnswer = () => {
    const userAns = selectedBlocks.join('');
    const isCorrect = userAns.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setAnswerFeedback({ isCorrect });
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      deductLife();
    }
  };

  // --- Handler for Keyboard Input / Typing ---
  const handleCheckTypingAnswer = (e) => {
    e.preventDefault();
    if (!typedInput.trim() || answerFeedback) return;

    const isCorrect = typedInput.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setAnswerFeedback({ isCorrect });
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      deductLife();
    }
  };

  // --- Move to Next Question ---
  const handleNextQuestion = () => {
    if (currentQ.type === 'matching' && matchedPairs.length === currentQ.pairs.length) {
      setScore(prev => prev + 1);
    }

    setSelectedLeft(null);
    setMatchedPairs([]);
    setAnswerFeedback(null);
    setSelectedOption(null);
    setSelectedBlocks([]);
    setTypedInput('');

    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  // --- Helper to Render Question Prompt Header ---
  const renderQuestionPrompt = () => {
    const targetWord = currentQ.targetWord;
    const hasIllust = currentQ.hasIllustration || (targetWord && hasVocabIllustration(targetWord));

    if (hasIllust && targetWord && currentQ.isReverse) {
      // Reverse direction: Prompt was English -> Replace English text with SVG Picture!
      return (
        <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant text-center flex flex-col items-center justify-center space-y-2">
          <VocabIllustration word={targetWord} size="lg" />
        </div>
      );
    }

    // Korean Question (or Fallback if no illustration exists for reverse prompt)
    return (
      <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant text-center space-y-2">
        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
          {currentQ.isReverse ? 'Hint' : 'Korean Word'}
        </span>
        <h2 className="text-4xl font-black text-on-surface font-headline">{currentQ.targetKorean}</h2>
      </div>
    );
  };

  // --- LESSON FAILED SCREEN (Out of Hearts) ---
  if (isFailed) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12 text-center space-y-6">
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xl space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-5xl">heart_broken</span>
          </div>

          <div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Lesson Failed
            </span>
            <h2 className="text-2xl font-black text-on-surface font-headline mt-2">
              Out of Hearts!
            </h2>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onExitQuiz}
              className="flex-1 py-3.5 border border-outline-variant text-on-surface hover:bg-surface-container-low font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
            >
              Exit
            </button>

            <button
              onClick={handleTryAgain}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LESSON COMPLETED SCREEN (Success) ---
  if (isFinished) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12 text-center space-y-6">
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xl space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-5xl">workspace_premium</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-on-surface font-headline mt-2">
              Lesson Passed!
            </h2>
          </div>

          <div className="flex justify-center items-center gap-1.5 py-2">
            {[1, 2, 3].map((hIdx) => (
              <span
                key={hIdx}
                className={`material-symbols-outlined text-2xl ${hIdx <= lives ? 'text-rose-500 fill-1' : 'text-outline/30'
                  }`}
              >
                {hIdx <= lives ? 'favorite' : 'favorite_border'}
              </span>
            ))}
          </div>

          <button
            onClick={onFinishQuiz}
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px]"
          >
            Return to Lesson Pathway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitQuiz}
            className="p-2 text-outline hover:text-on-surface rounded-xl hover:bg-surface-container-low min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            title="Exit Quiz"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-outline font-label">
            {title}
          </span>
        </div>

        {/* Progress Bar & Hearts */}
        <div className="flex items-center gap-3 flex-1 max-w-xs justify-end">
          <div
            className="w-24 sm:w-32 bg-surface-container-high h-2 rounded-full overflow-hidden border border-outline-variant/40"
            role="progressbar"
            aria-valuenow={Math.round(((currentIndex + 1) / quizQuestions.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.round(((currentIndex + 1) / quizQuestions.length) * 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
            {[1, 2, 3].map((hIdx) => (
              <span
                key={hIdx}
                className={`material-symbols-outlined text-base transition-transform ${hIdx <= lives ? 'text-rose-500 fill-1 scale-110' : 'text-rose-200'
                  }`}
              >
                {hIdx <= lives ? 'favorite' : 'favorite_border'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-lg space-y-6 animate-in fade-in">
        {/* ---------------- TYPE 1: MATCHING ---------------- */}
        {currentQ.type === 'matching' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-2">
                {currentQ.leftItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedLeft?.id === item.id;
                  const useIllust = item.showIllustration && item.word && hasVocabIllustration(item.word);

                  return (
                    <button
                      key={`left-${item.id}`}
                      disabled={isMatched}
                      onClick={() => handleLeftClick(item)}
                      className={`w-full py-2 px-3 rounded-2xl border text-md font-bold flex items-center justify-center transition-all cursor-pointer min-h-[88px] ${isMatched
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'bg-primary/20 border-2 border-primary text-primary shadow-md'
                          : 'bg-surface-container-low border-outline-variant hover:bg-surface-container text-on-surface'
                        }`}
                    >
                      {useIllust ? (
                        <VocabIllustration word={item.word} size="sm" />
                      ) : (
                        <span>{item.text}</span>
                      )}
                      {isMatched ? <span className="ml-1 text-emerald-700">✓</span> : null}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                {currentQ.rightItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const useIllust = item.showIllustration && item.word && hasVocabIllustration(item.word);

                  return (
                    <button
                      key={`right-${item.id}`}
                      disabled={isMatched}
                      onClick={() => handleRightClick(item)}
                      className={`w-full py-2 px-3 rounded-2xl border text-md font-semibold flex items-center justify-center transition-all cursor-pointer min-h-[88px] ${isMatched
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 cursor-not-allowed opacity-60'
                        : selectedLeft
                          ? 'bg-surface-container-lowest border-primary/50 text-on-surface hover:bg-primary/10'
                          : 'bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container'
                        }`}
                    >
                      {useIllust ? (
                        <VocabIllustration word={item.word} size="sm" />
                      ) : (
                        <span>{item.text}</span>
                      )}
                      {isMatched ? <span className="ml-1 text-emerald-700">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 2: MULTIPLE CHOICE ---------------- */}
        {currentQ.type === 'multiple_choice' && (
          <div className="space-y-4">
            {renderQuestionPrompt()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.text;
                let btnStyle = 'bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container';

                if (answerFeedback) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-2 border-rose-500 text-rose-900 font-bold';
                  }
                }

                const useIllust = opt.showIllustration && opt.word && hasVocabIllustration(opt.word);

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={!!answerFeedback}
                    className={`py-2 px-4 rounded-2xl border text-sm font-bold transition-all cursor-pointer min-h-[88px] flex flex-col items-center justify-center ${btnStyle}`}
                  >
                    {useIllust ? (
                      <VocabIllustration word={opt.word} size="sm" />
                    ) : (
                      <span>{opt.text}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- TYPE 3: SYLLABLE BLOCKS ---------------- */}
        {currentQ.type === 'syllable_blocks' && (
          <div className="space-y-4">
            {renderQuestionPrompt()}

            {/* Answer Display Drop Area */}
            <div className="p-4 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant min-h-[56px] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                {selectedBlocks.length === 0 ? (
                  <span className="text-xs text-outline italic">Tap blocks below to build answer...</span>
                ) : (
                  selectedBlocks.map((blk, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/20 text-primary font-mono font-bold text-sm rounded-lg">
                      {blk}
                    </span>
                  ))
                )}
              </div>

              {selectedBlocks.length > 0 && !answerFeedback && (
                <button
                  type="button"
                  onClick={handleClearBlocks}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Block Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {currentQ.blocks.map((blk, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddBlock(blk)}
                  disabled={!!answerFeedback}
                  className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono font-bold text-sm rounded-xl border border-outline-variant transition-transform hover:scale-105 cursor-pointer"
                >
                  {blk}
                </button>
              ))}
            </div>

            {!answerFeedback && selectedBlocks.length > 0 && (
              <button
                type="button"
                onClick={handleCheckBlocksAnswer}
                className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Check Answer
              </button>
            )}
          </div>
        )}

        {/* ---------------- TYPE 4: KEYBOARD INPUT / TYPING ---------------- */}
        {currentQ.type === 'keyboard_input' && (
          <div className="space-y-4">
            {renderQuestionPrompt()}

            <form onSubmit={handleCheckTypingAnswer} className="space-y-3">
              <input
                type="text"
                value={typedInput}
                disabled={!!answerFeedback}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type using keyboard or keypad below..."
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-2xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {!answerFeedback && (
                <>
                  <KoreanKeypad
                    value={typedInput}
                    onChange={(newVal) => setTypedInput(newVal)}
                  />

                  <button
                    type="submit"
                    disabled={!typedInput.trim()}
                    className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* ANSWER FEEDBACK BANNER */}
        {answerFeedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in ${answerFeedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-xl">
                {answerFeedback.isCorrect ? 'check_circle' : 'cancel'}
              </span>
              <p className="text-xs font-bold">
                {answerFeedback.isCorrect ? 'Correct! 🎉' : 'Incorrect'}
              </p>
            </div>

            {!answerFeedback.isCorrect && currentQ.correctAnswer && (
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/80 px-2.5 py-1 rounded-xl border border-rose-200 shadow-2xs">
                <span className="text-outline text-[10px] uppercase font-bold">Correct Answer:</span>
                <span className="font-mono font-extrabold text-rose-900">{currentQ.correctAnswer}</span>
              </div>
            )}
          </div>
        )}

        {/* NEXT QUESTION ACTION */}
        {(answerFeedback || (currentQ.type === 'matching' && matchedPairs.length === currentQ.pairs.length)) && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[48px]"
          >
            <span>{currentIndex + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
