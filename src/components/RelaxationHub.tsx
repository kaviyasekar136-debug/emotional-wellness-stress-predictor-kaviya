import React, { useState } from 'react';
import { BreathingExercise } from './BreathingExercise';
import { StudyBreakTimer } from './StudyBreakTimer';
import { Wind, Coffee, Heart, Sparkles, Moon, Sun, ShieldAlert, Loader2 } from 'lucide-react';
import { RoutineItem } from '../types/wellness';

export const RelaxationHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'breathing' | 'studyBreak' | 'library'>('breathing');
  const [customCategory, setCustomCategory] = useState<'Breathing' | 'Relaxation' | 'Study Break' | 'Healthy Routine'>('Relaxation');
  const [customDuration, setCustomDuration] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<RoutineItem | null>(null);

  const curatedRoutines: RoutineItem[] = [
    {
      title: 'Progressive Muscle Relaxation (PMR)',
      category: 'Relaxation',
      durationMinutes: 8,
      description: 'Systematically release somatic tension across forehead, jaw, neck, trapezoids, and hands.',
      actionableSteps: [
        'Find a quiet, supportive chair with feet flat and spine tall.',
        'Squeeze your facial muscles tight for 5 seconds, then release completely with a long exhale.',
        'Pull shoulders up towards ears, hold for 5 seconds, and drop heavily.',
        'Clench both fists firmly, hold for 5 seconds, and open hands slowly feeling warm blood flow.',
        'Notice the contrast between tension and released relaxation.',
      ],
    },
    {
      title: 'Evening Digital Sunset & Melatonin Prep',
      category: 'Healthy Routine',
      durationMinutes: 15,
      description: 'Calm the circadian clock 60 minutes before bed to deepen slow-wave deep sleep.',
      actionableSteps: [
        'Switch room lighting from harsh overhead lights to soft warm lamps.',
        'Place phone or laptop in another room or on airplane mode.',
        'Brew a warm cup of caffeine-free chamomile or lavender tea.',
        'Jot down any lingering tomorrow tasks on a paper pad to unload working memory.',
      ],
    },
    {
      title: '5-4-3-2-1 Sensory Grounding',
      category: 'Relaxation',
      durationMinutes: 4,
      description: 'Quickly anchor racing anxiety by reconnecting with immediate tactile reality.',
      actionableSteps: [
        'Acknowledge 5 things you can see around you right now.',
        'Acknowledge 4 things you can physically feel (e.g. feet on floor, sweater on arms).',
        'Acknowledge 3 things you can hear (e.g. ambient hum, birds outside, breath).',
        'Acknowledge 2 things you can smell or enjoy smelling.',
        'Acknowledge 1 positive quality about yourself or your effort today.',
      ],
    },
    {
      title: 'Post-Lecture Posture & Cervical Spine Realignment',
      category: 'Study Break',
      durationMinutes: 5,
      description: 'Counteract the "forward head" posture from textbooks and laptop screens.',
      actionableSteps: [
        'Stand against a flat wall with heels, buttocks, and upper back touching.',
        'Tuck chin backward like making a double chin for 10 seconds (5 repetitions).',
        'Extend arms overhead in a "Y" shape and breathe deeply into lower ribs.',
      ],
    },
  ];

  const handleGenerateCustomRoutine = async () => {
    setIsGenerating(true);
    setGeneratedRoutine(null);
    try {
      const response = await fetch('/api/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stressLevel: 'Moderate',
          preferredCategory: customCategory,
          duration: customDuration,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedRoutine(data);
      }
    } catch (err) {
      console.error('Failed generating routine:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hub Top Section Selector */}
      <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Wellness Toolkit</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Wellness &amp; Relaxation Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Science-backed somatic exercises, interactive breathwork, study timers, and healthy restorative habits.
            </p>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveSection('breathing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'breathing'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathing Pacer</span>
            </button>

            <button
              onClick={() => setActiveSection('studyBreak')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'studyBreak'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Study Breaks</span>
            </button>

            <button
              onClick={() => setActiveSection('library')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === 'library'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Routines Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Subsection */}
      {activeSection === 'breathing' && <BreathingExercise />}
      {activeSection === 'studyBreak' && <StudyBreakTimer />}

      {activeSection === 'library' && (
        <div className="space-y-6">
          {/* Custom Routine Generator Card */}
          <div className="p-6 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-blue-50/60 rounded-2xl border border-purple-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Custom Routine Synthesizer</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Tailor a Custom Exercise</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select category and time, and our AI model will compile step-by-step guidance tailored for you.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exercise Focus</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="Breathing">Breathing &amp; Breathwork</option>
                  <option value="Relaxation">Mindful Relaxation</option>
                  <option value="Study Break">Study &amp; Desk Break</option>
                  <option value="Healthy Routine">Sleep &amp; Healthy Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
                <select
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value={3}>3 Minutes (Rapid)</option>
                  <option value={5}>5 Minutes (Standard)</option>
                  <option value={10}>10 Minutes (Deep)</option>
                  <option value={15}>15 Minutes (Full Reset)</option>
                </select>
              </div>

              <div className="self-end">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateCustomRoutine}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Custom Steps</span>
                </button>
              </div>
            </div>

            {/* Generated Routine Display */}
            {generatedRoutine && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-purple-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-purple-700">{generatedRoutine.category}</span>
                  <span className="font-mono text-slate-500">{generatedRoutine.durationMinutes} min</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{generatedRoutine.title}</h4>
                <p className="text-xs text-slate-600 mb-3">{generatedRoutine.description}</p>
                <div className="space-y-1.5">
                  {generatedRoutine.actionableSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="font-bold text-purple-600 shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Curated Routines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curatedRoutines.map((routine, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-purple-100 shadow-xs hover:border-purple-200 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-purple-700">{routine.category}</span>
                    <span className="font-mono text-slate-500">{routine.durationMinutes} mins</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{routine.title}</h4>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{routine.description}</p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    {routine.actionableSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-purple-600 font-bold shrink-0">{sIdx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Evidence-based clinical routine</span>
                  <span className="font-medium text-purple-700">Self-guided</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
