import React, { useState } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Sparkles,
  Moon,
  Briefcase,
  Activity,
  CupSoda,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { DailyCheckIn, MoodType, PredictionData } from '../types/wellness';
import confetti from 'canvas-confetti';

interface CheckInFormProps {
  onCheckInCompleted: (entry: DailyCheckIn) => void;
  onNavigateToRoutine: (category: string) => void;
}

const MOOD_OPTIONS: Array<{ type: MoodType; label: string; icon: React.ReactNode; color: string; desc: string }> = [
  { type: 'joyful', label: 'Joyful & Energized', icon: <Smile className="w-5 h-5" />, color: 'hover:border-amber-300 hover:bg-amber-50/50', desc: 'Feeling upbeat, grateful, or inspired' },
  { type: 'calm', label: 'Calm & Balanced', icon: <Sparkles className="w-5 h-5" />, color: 'hover:border-purple-300 hover:bg-purple-50/50', desc: 'Centered, peaceful, and in flow' },
  { type: 'neutral', label: 'Neutral / Steady', icon: <Meh className="w-5 h-5" />, color: 'hover:border-slate-300 hover:bg-slate-50', desc: 'Normal baseline, getting through tasks' },
  { type: 'tired', label: 'Tired / Sluggish', icon: <Moon className="w-5 h-5" />, color: 'hover:border-blue-300 hover:bg-blue-50/50', desc: 'Low battery, sluggish, needing rest' },
  { type: 'anxious', label: 'Anxious / Restless', icon: <Frown className="w-5 h-5" />, color: 'hover:border-orange-300 hover:bg-orange-50/50', desc: 'Racing thoughts, tension, or worry' },
  { type: 'overwhelmed', label: 'Overwhelmed', icon: <AlertTriangle className="w-5 h-5" />, color: 'hover:border-rose-300 hover:bg-rose-50/50', desc: 'Tasks piling up, acute pressure' },
];

const SUGGESTED_FEELING_TAGS = [
  'Exam approaching',
  'Deep productive flow',
  'Tight deadline',
  'Great night of sleep',
  'Need a break',
  'Caffeine crash',
  'Family/friend support',
  'Physical fatigue',
];

export const CheckInForm: React.FC<CheckInFormProps> = ({ onCheckInCompleted, onNavigateToRoutine }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [feelingsText, setFeelingsText] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<DailyCheckIn['sleepQuality']>('Restful');
  const [workloadHours, setWorkloadHours] = useState<number>(7.0);
  const [workloadIntensity, setWorkloadIntensity] = useState<number>(5);
  const [selfReportedStress, setSelfReportedStress] = useState<number>(4);
  const [physicalActivityMinutes, setPhysicalActivityMinutes] = useState<number>(25);
  const [caffeineCups, setCaffeineCups] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing inputs...');
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addTagToFeelings = (tag: string) => {
    if (!feelingsText.includes(tag)) {
      setFeelingsText((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setPredictionResult(null);

    // Simulated progress messages for enjoyable AI feedback
    setLoadingStep('Tokenizing emotional valence & freeform journal...');
    setTimeout(() => {
      setLoadingStep('Cross-referencing circadian sleep deficit & cognitive load...');
    }, 700);
    setTimeout(() => {
      setLoadingStep('Synthesizing evidence-based relaxation routines...');
    }, 1400);

    const payload = {
      mood: selectedMood,
      feelingsText,
      sleepHours,
      sleepQuality,
      workloadHours,
      workloadIntensity,
      selfReportedStress,
      physicalActivityMinutes,
      caffeineCups,
    };

    try {
      const response = await fetch('/api/predict-stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const result: PredictionData = await response.json();
      setPredictionResult(result);

      // Create new check-in object and notify parent
      const now = new Date();
      const newEntry: DailyCheckIn = {
        id: `chk_${Date.now()}`,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(),
        mood: selectedMood,
        feelingsText,
        sleepHours,
        sleepQuality,
        workloadHours,
        workloadIntensity,
        selfReportedStress,
        physicalActivityMinutes,
        caffeineCups,
        waterGlasses: 6,
        prediction: result,
      };

      onCheckInCompleted(newEntry);

      // Confetti on completed check-in
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#a78bfa', '#818cf8', '#38bdf8'],
        });
      } catch {
        // Ignore
      }
    } catch (err) {
      console.error('Prediction API call failed:', err);
      setErrorMsg('Unable to reach prediction model. Please check network connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assessment Form Card */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-blue-50/60 border-b border-purple-100/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Factor Assessment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">Daily Emotional Wellness &amp; Stress Check-in</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log your mood, feelings, sleep, and workload to run our AI/ML classification and unlock tailored relaxation routines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Mood Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. How are you feeling overall today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MOOD_OPTIONS.map((item) => {
                const isSelected = selectedMood === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedMood(item.type)}
                    className={`p-3 rounded-xl border text-left transition-all ${item.color} ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-200 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'text-purple-700 bg-white' : 'text-slate-500'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Feelings & Journal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Feelings &amp; Journal Reflection
              </label>
              <span className="text-[11px] text-slate-400">Natural language parsed by AI</span>
            </div>
            <textarea
              rows={3}
              value={feelingsText}
              onChange={(e) => setFeelingsText(e.target.value)}
              placeholder="Describe your current emotional state, what went well, physical sensations (e.g. neck tension, calm heart), or upcoming deadlines..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder:text-slate-400"
            />

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1">Quick tags:</span>
              {SUGGESTED_FEELING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTagToFeelings(tag)}
                  className="px-2.5 py-1 text-[11px] font-medium text-purple-700 bg-purple-50/70 hover:bg-purple-100 rounded-lg border border-purple-200/60 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Sleep & Recovery */}
          <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-100/80 space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Sleep Architecture &amp; Quality
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Sleep Duration</span>
                  <span className="font-bold font-mono text-purple-700 text-sm">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>3h (Severe deficit)</span>
                  <span>7.5h (Target)</span>
                  <span>12h</span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-700 mb-1">Subjective Sleep Quality</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Restful', 'Moderate', 'Restless'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                        sleepQuality === q
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Workload & Stress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workload Hours */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Workload / Study Hours</span>
                </div>
                <span className="font-bold font-mono text-indigo-700 text-sm">{workloadHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={workloadHours}
                onChange={(e) => setWorkloadHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">Cognitive Intensity:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold font-mono text-slate-800">{workloadIntensity} / 10</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={workloadIntensity}
                    onChange={(e) => setWorkloadIntensity(parseInt(e.target.value, 10))}
                    className="w-20 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Self-Reported Stress */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Self-Reported Stress Baseline</span>
                </div>
                <span className="font-bold font-mono text-rose-600 text-sm">{selfReportedStress} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={selfReportedStress}
                onChange={(e) => setSelfReportedStress(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>1 (Serene)</span>
                <span>5 (Manageable)</span>
                <span>10 (Overload)</span>
              </div>

              {/* Lifestyle Extras */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={physicalActivityMinutes}
                    onChange={(e) => setPhysicalActivityMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-12 px-1.5 py-0.5 border border-slate-200 rounded font-mono text-center text-xs"
                  />
                  <span className="text-[11px] text-slate-500">min walk</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CupSoda className="w-3.5 h-3.5 text-amber-600" />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={caffeineCups}
                    onChange={(e) => setCaffeineCups(parseInt(e.target.value, 10) || 0)}
                    className="w-10 px-1.5 py-0.5 border border-slate-200 rounded font-mono text-center text-xs"
                  />
                  <span className="text-[11px] text-slate-500">cups coffee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Educational &amp; lifestyle wellness tool · Not a clinical diagnosis</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingStep}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Classify &amp; Predict Stress Level</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Result Reveal Card */}
      {predictionResult && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-gradient-to-r from-purple-100/80 via-indigo-50 to-blue-50/70 border-b border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AI Prediction Complete · Engine: {predictionResult.engineUsed}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Classification &amp; Wellness Report</h3>
            </div>

            {/* Stress Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Stress Probability Index</span>
                <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                  {predictionResult.stressScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </span>
              </div>

              <div
                className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-xs ${
                  predictionResult.predictedLevel === 'High'
                    ? 'bg-rose-600 text-white shadow-rose-200'
                    : predictionResult.predictedLevel === 'Moderate'
                    ? 'bg-amber-500 text-white shadow-amber-200'
                    : 'bg-emerald-600 text-white shadow-emerald-200'
                }`}
              >
                {predictionResult.predictedLevel} Stress
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Analysis Paragraph */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                Clinical-Grade AI Synthesis
              </span>
              <p className="text-sm text-slate-800 leading-relaxed">{predictionResult.summaryAnalysis}</p>

              {predictionResult.copingAffirmation && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs italic text-purple-900">
                  &ldquo;{predictionResult.copingAffirmation}&rdquo;
                </div>
              )}
            </div>

            {/* Dominant Driving Factors */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Key Contributing Stress Vectors
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {predictionResult.dominantFactors.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{item.factor}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.impact === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : item.impact === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Wellness Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Prescribed Wellness &amp; Relaxation Routines
                </h4>
                <span className="text-xs text-purple-700 font-medium">Ready to practice</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {predictionResult.recommendedRoutines.map((routine, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 hover:bg-purple-50/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] font-semibold text-purple-700">{routine.category}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{routine.durationMinutes} min</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 mb-1">{routine.title}</h5>
                      <p className="text-xs text-slate-600 mb-3">{routine.description}</p>

                      <ul className="space-y-1 mb-4">
                        {routine.actionableSteps.slice(0, 3).map((st, sIdx) => (
                          <li key={sIdx} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                            <span className="text-purple-600 font-bold">·</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToRoutine(routine.category)}
                      className="w-full py-1.5 px-3 text-xs font-semibold text-purple-800 bg-purple-100/70 hover:bg-purple-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Start Guided Session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
