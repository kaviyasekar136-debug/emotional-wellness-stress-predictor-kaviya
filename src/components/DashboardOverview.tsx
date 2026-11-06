import React from 'react';
import { DailyCheckIn, UserProfile } from '../types/wellness';
import {
  Sparkles,
  ArrowRight,
  Wind,
  Coffee,
  Heart,
  TrendingUp,
  Moon,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DEFAULT_BANNER } from '../utils/storage';

interface DashboardOverviewProps {
  user: UserProfile;
  latestEntry: DailyCheckIn | null;
  entries: DailyCheckIn[];
  onNavigateTab: (tab: 'checkin' | 'relaxation' | 'charts' | 'history') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  latestEntry,
  entries,
  onNavigateTab,
}) => {
  // Compute greeting based on local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayScore = latestEntry ? latestEntry.prediction.stressScore : 28;
  const todayLevel = latestEntry ? latestEntry.prediction.predictedLevel : 'Low';
  const todayMood = latestEntry ? latestEntry.mood : 'calm';
  const todaySleep = latestEntry ? latestEntry.sleepHours : 7.8;
  const todayWork = latestEntry ? latestEntry.workloadHours : 6.0;

  // Level badge and theme
  let levelColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let gaugeColor = 'from-emerald-400 to-teal-500';
  let levelAdvice = 'Your nervous system is operating in an optimal restorative rhythm. Keep up your healthy routines!';

  if (todayLevel === 'High') {
    levelColor = 'text-rose-700 bg-rose-50 border-rose-200';
    gaugeColor = 'from-rose-500 to-amber-500';
    levelAdvice = 'Elevated acute stress markers detected. Prioritize sensory breaks, hydration, and 5 minutes of box breathing.';
  } else if (todayLevel === 'Moderate') {
    levelColor = 'text-amber-700 bg-amber-50 border-amber-200';
    gaugeColor = 'from-amber-400 to-purple-500';
    levelAdvice = 'Manageable workload with mild tension. Interspersing short 5-minute study intervals will sustain your energy.';
  }

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card with Watercolor Zen Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-purple-100 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white min-h-[220px] flex items-center">
        {/* Tranquil Watercolor Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={DEFAULT_BANNER}
            alt="Calm lavender morning mist and lotus petals"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-900/75 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI-Powered Emotional Wellness Companion</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {greeting}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1.5 leading-relaxed">
            Welcome back to your emotional sanctuary. Your current check-in streak is{' '}
            <strong className="text-white font-mono">{user.streakDays} days</strong>. Take a mindful pause to reflect on your energy today.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-purple-950 bg-white hover:bg-purple-50 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <span>{latestEntry ? 'Update Today’s Check-in' : 'Take Daily Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('relaxation')}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-purple-500/30 hover:bg-purple-500/50 border border-purple-300/40 backdrop-blur-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathing Reset (3m)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Stress Status Meter & Quick Wellness Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's AI Stress Gauge & Synthesis (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-purple-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  Today&apos;s Physiological Status
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Stress Classification Index</h3>
              </div>

              <span className={`px-3 py-1 rounded-xl text-xs font-bold border uppercase tracking-wider ${levelColor}`}>
                {todayLevel} Stress
              </span>
            </div>

            {/* Gauge Bar */}
            <div className="mt-2 mb-4">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Model Predicted Score</span>
                <span className="font-extrabold font-mono text-slate-900 text-lg tabular-nums">
                  {todayScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>

              <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gaugeColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(5, todayScore))}%` }}
                />
              </div>

              {/* Band labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>0 Low (Calm)</span>
                <span>38 Moderate</span>
                <span>68 High (Overload)</span>
                <span>100</span>
              </div>
            </div>

            {/* Today's Context Card */}
            <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100/80 text-xs text-slate-700 space-y-2 mt-4">
              <div className="flex items-center gap-2 font-semibold text-purple-900">
                <Heart className="w-4 h-4 text-purple-600" />
                <span>AI Guidance Summary</span>
              </div>
              <p className="leading-relaxed text-slate-700">{levelAdvice}</p>

              {latestEntry?.prediction.copingAffirmation && (
                <p className="text-[11px] text-purple-800 italic pt-1 border-t border-purple-200/50">
                  &ldquo;{latestEntry.prediction.copingAffirmation}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-xs text-center">
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-400 block text-[11px]">Reported Mood</span>
              <strong className="capitalize text-purple-800 text-xs">{todayMood}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-400 block text-[11px]">Nightly Sleep</span>
              <strong className="font-mono text-slate-800 text-xs">{todaySleep} hrs</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-400 block text-[11px]">Workload</span>
              <strong className="font-mono text-slate-800 text-xs">{todayWork} hrs</strong>
            </div>
          </div>
        </div>

        {/* Right: Quick Launch Wellness Utilities (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Box Breathing card */}
          <div
            onClick={() => onNavigateTab('relaxation')}
            className="p-5 bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white rounded-2xl border border-purple-100 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Interactive Breathing Pacer</h4>
            <p className="text-xs text-slate-500 mt-1">
              Box Breathing &amp; 4-7-8 relaxing breath with soothing chime audio to calm rapid heart rate.
            </p>
          </div>

          {/* Study Break card */}
          <div
            onClick={() => onNavigateTab('relaxation')}
            className="p-5 bg-gradient-to-br from-blue-50 via-slate-50 to-white rounded-2xl border border-blue-100 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Timer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Study Break &amp; Focus Timer</h4>
            <p className="text-xs text-slate-500 mt-1">
              Pomodoro 25/5 rhythm with 20-20-20 eye strain breaks and desk ergonomics stretches.
            </p>
          </div>

          {/* Weekly Trends card */}
          <div
            onClick={() => onNavigateTab('charts')}
            className="p-5 bg-gradient-to-br from-purple-50/40 to-slate-50 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Interactive Trends &amp; Analytics</h4>
            <p className="text-xs text-slate-500 mt-1">
              Visual 7-day &amp; 30-day graphs, sleep vs. stress correlations, and mood breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Emotional Logs Strip */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Emotional Check-ins</h3>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors"
          >
            View Full History ({entries.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {entries.slice(0, 4).map((entry) => {
            const isHigh = entry.prediction.predictedLevel === 'High';
            const isMod = entry.prediction.predictedLevel === 'Moderate';

            return (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-purple-50/20 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-500">{entry.date.slice(5)}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800'
                        : isMod
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {entry.prediction.predictedLevel}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-bold text-sm text-slate-900 font-mono">
                    {entry.prediction.stressScore}
                  </span>
                  <span className="text-[11px] text-slate-400">/ 100</span>
                  <span className="text-xs text-purple-700 capitalize ml-auto font-medium">{entry.mood}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-blue-400" />
                    {entry.sleepHours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-indigo-400" />
                    {entry.workloadHours}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
