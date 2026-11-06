import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { mindfulnessAudio } from '../utils/audio';

type BreathTechnique = 'box' | '478' | 'coherence';

interface TechniqueConfig {
  name: string;
  tagline: string;
  description: string;
  phases: Array<{ name: 'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'; duration: number }>;
}

const TECHNIQUES: Record<BreathTechnique, TechniqueConfig> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    tagline: 'Acute Stress & Cortisol Downregulation',
    description: 'Used by athletes and emergency responders to reset heart rate variability and calm panic.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold Empty', duration: 4 },
    ],
  },
  '478': {
    name: '4-7-8 Relaxing Breath',
    tagline: 'Parasympathetic Rest & Evening Calmer',
    description: 'Dr. Andrew Weil’s natural tranquilizer technique to relieve racing thoughts before sleep.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
  },
  coherence: {
    name: 'Heart Coherence (5-5)',
    tagline: 'Cognitive Equilibrium & Flow State',
    description: 'Aligns cardiovascular rhythms with respiratory sinus arrhythmia for steady focus.',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 },
    ],
  },
};

export const BreathingExercise: React.FC = () => {
  const [technique, setTechnique] = useState<BreathTechnique>('box');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TECHNIQUES.box.phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activeTechnique = TECHNIQUES[technique];
  const currentPhase = activeTechnique.phases[phaseIndex];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync audio toggle with singleton
  const toggleSound = () => {
    mindfulnessAudio.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Reset pacer state when switching techniques
  const handleSelectTechnique = (techKey: BreathTechnique) => {
    setIsActive(false);
    setTechnique(techKey);
    setPhaseIndex(0);
    setSecondsRemaining(TECHNIQUES[techKey].phases[0].duration);
    setCompletedCycles(0);
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance phase
          const nextIndex = (phaseIndex + 1) % activeTechnique.phases.length;
          setPhaseIndex(nextIndex);

          // If loop completed a full cycle
          if (nextIndex === 0) {
            setCompletedCycles((c) => c + 1);
            if (soundEnabled) mindfulnessAudio.playChime('complete');
          } else {
            const nextPhaseName = activeTechnique.phases[nextIndex].name;
            if (soundEnabled) {
              if (nextPhaseName === 'Inhale') mindfulnessAudio.playChime('inhale');
              else if (nextPhaseName.startsWith('Hold')) mindfulnessAudio.playChime('hold');
              else mindfulnessAudio.playChime('exhale');
            }
          }

          return activeTechnique.phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phaseIndex, activeTechnique, soundEnabled]);

  const handleToggleActive = () => {
    if (!isActive) {
      // Starting: play inhale chime
      if (soundEnabled) mindfulnessAudio.playChime('inhale');
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(activeTechnique.phases[0].duration);
    setCompletedCycles(0);
  };

  // Compute visual circle scale based on phase
  let scaleClass = 'scale-100';
  let instruction = 'Begin whenever ready';
  let colorTone = 'from-purple-400 to-indigo-400';

  if (isActive) {
    if (currentPhase.name === 'Inhale') {
      scaleClass = 'scale-125';
      instruction = 'Breathe in slowly through the nose...';
      colorTone = 'from-purple-500 via-indigo-400 to-blue-400 shadow-purple-300/60';
    } else if (currentPhase.name.startsWith('Hold')) {
      scaleClass = 'scale-120';
      instruction = currentPhase.name === 'Hold Empty' ? 'Pause gently with empty lungs...' : 'Gently hold breath with relaxed shoulders...';
      colorTone = 'from-indigo-500 via-purple-500 to-indigo-600 shadow-indigo-300/60';
    } else if (currentPhase.name === 'Exhale') {
      scaleClass = 'scale-90';
      instruction = 'Release and exhale smoothly through mouth...';
      colorTone = 'from-blue-400 via-purple-400 to-indigo-400 shadow-blue-300/60';
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
      {/* Top Banner / Tab Selector */}
      <div className="p-6 bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-blue-50/60 border-b border-purple-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomic Nervous System Regulation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Interactive Breathing Pacer</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow the rhythmic sphere and harmonized audio chimes to lower acute cortisol within 3 minutes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-purple-100/70 border-purple-200 text-purple-800'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
              title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-700" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">{soundEnabled ? 'Audio Chimes On' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Technique Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
          {(Object.keys(TECHNIQUES) as BreathTechnique[]).map((key) => {
            const item = TECHNIQUES[key];
            const isSelected = technique === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectTechnique(key)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white border-purple-300 shadow-sm ring-1 ring-purple-300'
                    : 'bg-white/60 border-purple-100/80 hover:bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                    {item.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <p className="text-[11px] text-purple-700/80 font-medium mt-0.5">{item.tagline}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Breathing Pacer Canvas */}
      <div className="p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white min-h-[380px]">
        {/* Subtle background concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-72 h-72 rounded-full border border-purple-200/50" />
          <div className="absolute w-96 h-96 rounded-full border border-indigo-100/50" />
          <div className="absolute w-[460px] h-[460px] rounded-full border border-blue-50/60" />
        </div>

        {/* Dynamic Sphere Container */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr ${colorTone} shadow-2xl transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-white text-center p-4 ${scaleClass}`}
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-white/90">
              {isActive ? currentPhase.name : 'Ready'}
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight my-1 font-mono tabular-nums">
              {isActive ? secondsRemaining : activeTechnique.phases[0].duration}
            </span>
            <span className="text-[11px] text-white/80">
              {isActive ? `${phaseIndex + 1} of ${activeTechnique.phases.length}` : 'Click Start'}
            </span>
          </div>

          <p className="mt-8 text-sm font-medium text-slate-700 text-center max-w-sm transition-all duration-500 min-h-[24px]">
            {instruction}
          </p>
        </div>

        {/* Stats & Cycle Counter */}
        <div className="flex items-center gap-6 text-xs text-slate-500 z-10 mt-2 mb-6">
          <div>
            <span>Completed Cycles: </span>
            <strong className="text-purple-700 font-mono text-sm">{completedCycles}</strong>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div>
            <span>Total Time: </span>
            <strong className="text-purple-700 font-mono text-sm">
              {Math.floor((completedCycles * activeTechnique.phases.reduce((a, b) => a + b.duration, 0)) / 60)}m{' '}
              {(completedCycles * activeTechnique.phases.reduce((a, b) => a + b.duration, 0)) % 60}s
            </strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleToggleActive}
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-sm flex items-center gap-2 transition-all ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 hover:shadow-md'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{completedCycles > 0 ? 'Resume Pacer' : 'Begin Pacer'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Reset Pacer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
