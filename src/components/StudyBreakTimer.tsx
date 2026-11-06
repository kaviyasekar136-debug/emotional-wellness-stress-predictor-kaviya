import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mindfulnessAudio } from '../utils/audio';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS: Record<TimerMode, { label: string; minutes: number; hint: string }> = {
  focus: {
    label: 'Deep Focus Session',
    minutes: 25,
    hint: 'Single-task with distractions minimized. Give your brain uninterrupted clarity.',
  },
  shortBreak: {
    label: '5-Minute Mindful Break',
    minutes: 5,
    hint: 'Step away from screen, drink fresh water, and stretch your spine.',
  },
  longBreak: {
    label: '15-Minute Rejuvenation',
    minutes: 15,
    hint: 'Take a short walk, enjoy herbal tea, or practice progressive relaxation.',
  },
};

const STRETCHES = [
  { id: '1', title: 'Shoulder Blades Pinch & Roll', desc: 'Roll shoulders back 5 times, then squeeze shoulder blades together for 5 seconds.' },
  { id: '2', title: '20-20-20 Eye Rest', desc: 'Look at an object at least 20 feet away for 20 seconds to relax ciliary eye muscles.' },
  { id: '3', title: 'Wrist & Forearm Flex', desc: 'Extend arm with palm facing forward, gently pull fingers back for 10 seconds each hand.' },
  { id: '4', title: 'Thoracic Seated Twist', desc: 'Sit upright, place right hand on left knee, gently twist upper torso to the left and exhale.' },
];

export const StudyBreakTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_DURATIONS.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [checkedStretches, setCheckedStretches] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            mindfulnessAudio.playChime('complete');

            if (mode === 'focus') {
              setCompletedSessions((s) => s + 1);
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                  colors: ['#a855f7', '#6366f1', '#38bdf8'],
                });
              } catch {
                // Ignore confetti error
              }
              setMode('shortBreak');
              return TIMER_DURATIONS.shortBreak.minutes * 60;
            } else {
              setMode('focus');
              return TIMER_DURATIONS.focus.minutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(TIMER_DURATIONS[newMode].minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(TIMER_DURATIONS[mode].minutes * 60);
  };

  const toggleStretch = (id: string) => {
    setCheckedStretches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalSecs = TIMER_DURATIONS[mode].minutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSecs - secondsLeft) / totalSecs) * 100));

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-50/70 via-blue-50/40 to-indigo-50/50 border-b border-purple-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wide uppercase">
              <Coffee className="w-3.5 h-3.5" />
              <span>Cognitive Fatigue Protection</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Study Break &amp; Focus Timer</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured interval rhythm to sustain high comprehension without mental burnout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sessions Finished Today:</span>
            <span className="px-2.5 py-1 text-xs font-bold text-purple-800 bg-purple-100 rounded-lg font-mono">
              {completedSessions}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <button
            type="button"
            onClick={() => switchMode('focus')}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
              mode === 'focus'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">25m Focus</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('shortBreak')}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
              mode === 'shortBreak'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">5m Break</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('longBreak')}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">15m Reset</span>
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Timer Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-purple-100"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-purple-600 transition-all duration-500 ease-out"
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {formattedTime}
              </span>
              <span className="text-xs font-semibold text-purple-700 mt-1 uppercase tracking-wider">
                {TIMER_DURATIONS[mode].label}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-xs mt-4">
            {TIMER_DURATIONS[mode].hint}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-sm flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 hover:shadow-md'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Physical Reset Stretches & Eye Rest */}
        <div className="lg:col-span-7 bg-purple-50/30 rounded-xl p-5 border border-purple-100/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-700" />
              <h3 className="text-sm font-bold text-slate-900">Physical Reset Stretches</h3>
            </div>
            <span className="text-xs text-purple-700 font-medium">During Study Breaks</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Prolonged sitting and close-up screen reading create musculoskeletal tension. Check these off during your break:
          </p>

          <div className="space-y-2.5">
            {STRETCHES.map((item) => {
              const isDone = !!checkedStretches[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleStretch(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-purple-100/60 border-purple-300 text-purple-900'
                      : 'bg-white border-purple-100 hover:border-purple-200 text-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${isDone ? 'line-through text-purple-800' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
