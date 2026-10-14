import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRIVIA_QUESTIONS } from '../data/initialData';
import {
  Gamepad2,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';

export const GamesTab: React.FC = () => {
  const { user, awardPoints, playSound, themeConfig } = useApp();

  // Mode: 'trivia' | 'proverbs' | 'leaderboard'
  const [activeGame, setActiveGame] = useState<'trivia' | 'proverbs'>('trivia');

  // Trivia state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Yoruba Proverbs Game state
  const proverbs = [
    {
      id: 'p1',
      start: 'Agbajo owo la fi n...',
      missing: 'soya',
      options: ['soya', 'gbe eru', 'doko', 'rinna'],
      english: 'It is with a united fist that we beat our chest in confidence (Unity is strength).',
      context: 'Emphasizes community solidarity between Idanre and Ifedore youth.',
    },
    {
      id: 'p2',
      start: 'Ile la ti n ko eso...',
      missing: 'rode',
      options: ['rode', 'sun', 'fere', 'joko'],
      english: 'Good character and charity begin at home before radiating outside.',
      context: 'Encourages local community responsibility and youth civic integrity.',
    },
    {
      id: 'p3',
      start: "A ki i fi ina s'ori orule...",
      missing: 'sun',
      options: ['sun', 'korin', 'gbe', 'dake'],
      english: 'One does not sleep with fire smoldering on the roof (Take urgent action on community challenges).',
      context: 'Calls on youth to not remain passive regarding civic infrastructure.',
    },
  ];
  const [proverbIndex, setProverbIndex] = useState(0);
  const [proverbSelected, setProverbSelected] = useState<string | null>(null);
  const [proverbAnswered, setProverbAnswered] = useState(false);
  const [proverbScore, setProverbScore] = useState(0);
  const [proverbCompleted, setProverbCompleted] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentQIndex];
  const currentProverb = proverbs[proverbIndex];

  // Leaderboard mock data with user integrated
  const leaderboard = [
    { rank: 1, name: 'Folashade Arowolo', lga: 'Ifedore', points: 680, badge: 'Heritage Master' },
    { rank: 2, name: 'Adewale Bakare', lga: 'Idanre', points: 610, badge: 'Hill Explorer' },
    { rank: 3, name: user.name, lga: user.lga, points: Math.max(user.points, 460), badge: 'Active Citizen' },
    { rank: 4, name: 'Kehinde Akinwumi', lga: 'Idanre', points: 430, badge: 'Cocoa Pioneer' },
    { rank: 5, name: 'Blessing Oyeyemi', lga: 'Ifedore', points: 390, badge: 'Civic Leader' },
  ];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === currentQ.correctIndex) {
      playSound('celebrate');
      setScore(prev => prev + 1);
      awardPoints(10, 'Correct answer in Idanre Hills Trivia!');
    } else {
      playSound('click');
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    if (currentQIndex + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      playSound('celebrate');
      setIsCompleted(true);
      awardPoints(30, 'Completed Idanre & Ifedore Heritage Quiz Challenge!');
    }
  };

  const resetTrivia = () => {
    playSound('click');
    setCurrentQIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleProverbOption = (opt: string) => {
    if (proverbAnswered) return;
    setProverbSelected(opt);
    setProverbAnswered(true);

    if (opt === currentProverb.missing) {
      playSound('proverb');
      setProverbScore(prev => prev + 1);
      awardPoints(10, 'Mastered Yoruba Wisdom Proverb!');
    } else {
      playSound('click');
    }
  };

  const handleNextProverb = () => {
    playSound('click');
    if (proverbIndex + 1 < proverbs.length) {
      setProverbIndex(prev => prev + 1);
      setProverbSelected(null);
      setProverbAnswered(false);
    } else {
      playSound('celebrate');
      setProverbCompleted(true);
      awardPoints(25, 'Completed Yoruba Cultural Proverbs Challenge!');
    }
  };

  const resetProverbs = () => {
    setProverbIndex(0);
    setProverbSelected(null);
    setProverbAnswered(false);
    setProverbScore(0);
    setProverbCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            Lively Youth Entertainment & Culture
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Games & Heritage Challenges
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Learn local history, sharpen your Yoruba cultural wisdom, earn reward points, and compete on the inter-community leaderboard.
          </p>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setActiveGame('trivia')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeGame === 'trivia'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hills Trivia
          </button>
          <button
            onClick={() => setActiveGame('proverbs')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeGame === 'proverbs'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Owe Yoruba
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Screen (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          {activeGame === 'trivia' ? (
            /* TRIVIA CARD */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              {!isCompleted ? (
                <div>
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-4 border-b border-stone-100 mb-6">
                    <span className="font-semibold text-emerald-900">
                      Question {currentQIndex + 1} of {TRIVIA_QUESTIONS.length}
                    </span>
                    <span className="font-mono tabular-nums text-stone-700">
                      Score: <strong className="text-emerald-800">{score}</strong> / {TRIVIA_QUESTIONS.length}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-6">
                    {currentQ.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentQ.options.map((opt, idx) => {
                      const isCorrect = idx === currentQ.correctIndex;
                      const isChosen = selectedOption === idx;

                      let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        } else {
                          btnStyle = 'bg-stone-50/50 border-stone-100 text-stone-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full min-h-[52px] px-4 py-3 text-left text-sm font-medium rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                          )}
                          {hasAnswered && isChosen && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation */}
                  {hasAnswered && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 mb-6 text-xs text-stone-800">
                      <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        Heritage Insight:
                      </div>
                      <p className="leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  )}

                  {/* Next Button */}
                  {hasAnswered && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
                    >
                      {currentQIndex + 1 === TRIVIA_QUESTIONS.length ? 'See Final Results' : 'Next Question'}
                    </button>
                  )}
                </div>
              ) : (
                /* Completed Screen */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                    <Trophy className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-stone-900">
                    Challenge Complete!
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    You scored <strong className="font-mono text-emerald-800 text-base">{score} / {TRIVIA_QUESTIONS.length}</strong> on the Oke Idanre & Ifedore Heritage Challenge.
                  </p>

                  <div className="inline-block bg-emerald-50 text-emerald-900 font-semibold text-xs px-4 py-2 rounded-xl border border-emerald-200">
                    +40 Points Awarded to Your Youth Profile
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={resetTrivia}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Play Again
                    </button>

                    <button
                      onClick={() => setActiveGame('proverbs')}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
                    >
                      Try Yoruba Proverbs
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* YORUBA PROVERBS GAME */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              {!proverbCompleted ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-4 border-b border-stone-100 mb-6">
                    <span className="font-semibold text-emerald-900">
                      Owe {proverbIndex + 1} of {proverbs.length}
                    </span>
                    <span className="font-mono tabular-nums text-stone-700">
                      Mastery: <strong className="text-emerald-800">{proverbScore}</strong> / {proverbs.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 mb-6 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                      Complete the Yoruba Proverb
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                      "{currentProverb.start} <span className="underline decoration-emerald-600 decoration-2">[ ? ]</span>"
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {currentProverb.options.map(opt => {
                      const isCorrect = opt === currentProverb.missing;
                      const isChosen = proverbSelected === opt;

                      let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                      if (proverbAnswered) {
                        if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                        else if (isChosen) btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        else btnStyle = 'bg-stone-50/50 border-stone-100 text-stone-400 opacity-60';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={proverbAnswered}
                          onClick={() => handleProverbOption(opt)}
                          className={`min-h-[50px] p-3 text-center text-sm font-semibold rounded-xl border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {proverbAnswered && (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-6 text-xs text-stone-800 space-y-2">
                      <div>
                        <strong className="text-amber-950 block">English Translation:</strong>
                        <p className="italic text-stone-700">"{currentProverb.english}"</p>
                      </div>
                      <div>
                        <strong className="text-amber-950 block">Civic & Community Lesson:</strong>
                        <p className="text-stone-700">{currentProverb.context}</p>
                      </div>
                    </div>
                  )}

                  {proverbAnswered && (
                    <button
                      onClick={handleNextProverb}
                      className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
                    >
                      {proverbIndex + 1 === proverbs.length ? 'Complete Proverbs' : 'Next Proverb'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Owe Yoruba Mastery Complete!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    You scored <strong className="font-mono text-emerald-800 text-base">{proverbScore} / {proverbs.length}</strong>. Traditional wisdom passed from elders in Idanre & Ifedore lives on through your generation.
                  </p>
                  <div className="inline-block bg-emerald-50 text-emerald-900 font-semibold text-xs px-4 py-2 rounded-xl border border-emerald-200">
                    +35 Cultural Points Awarded
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={resetProverbs}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inter-Community Leaderboard (Col 3) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-stone-900">Youth Leaderboard</h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">All-Time</span>
            </div>

            <div className="space-y-3">
              {leaderboard.map(item => {
                const isCurrentUser = item.name === user.name;

                return (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                      isCurrentUser
                        ? 'bg-emerald-50/80 border border-emerald-200 font-semibold'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.rank === 1
                            ? 'bg-amber-400 text-stone-900'
                            : item.rank === 2
                            ? 'bg-stone-300 text-stone-800'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-900 truncate">
                          {item.name} {isCurrentUser && '(You)'}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {item.lga} LGA · {item.badge}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-bold text-emerald-800 tabular-nums shrink-0 ml-2">
                      {item.points} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-500">
              Participate in discussions, attend events, and volunteer to climb the ranks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
