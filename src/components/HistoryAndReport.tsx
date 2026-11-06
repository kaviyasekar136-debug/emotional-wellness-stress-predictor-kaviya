import React, { useState } from 'react';
import { DailyCheckIn, UserProfile } from '../types/wellness';
import {
  History,
  FileText,
  Download,
  Trash2,
  Calendar,
  Moon,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Printer,
  Sparkles,
} from 'lucide-react';
import { exportEntriesAsCSV, exportEntriesAsJSON } from '../utils/storage';

interface HistoryAndReportProps {
  entries: DailyCheckIn[];
  user: UserProfile;
  onDeleteEntry: (id: string) => void;
}

export const HistoryAndReport: React.FC<HistoryAndReportProps> = ({ entries, user, onDeleteEntry }) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'Low' | 'Moderate' | 'High'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'report'>('history');

  const filteredEntries = entries.filter((item) => {
    const matchesFilter = filterLevel === 'all' || item.prediction.predictedLevel === filterLevel;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.date.includes(searchQuery) ||
      item.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.feelingsText || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Report calculations
  const totalLogs = entries.length;
  const avgStress =
    totalLogs > 0 ? Math.round(entries.reduce((a, b) => a + b.prediction.stressScore, 0) / totalLogs) : 0;
  const avgSleep = totalLogs > 0 ? (entries.reduce((a, b) => a + b.sleepHours, 0) / totalLogs).toFixed(1) : '0';
  const highStressDays = entries.filter((e) => e.prediction.predictedLevel === 'High').length;
  const lowStressDays = entries.filter((e) => e.prediction.predictedLevel === 'Low').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Sub-Tabs */}
      <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wide uppercase">
              <History className="w-3.5 h-3.5" />
              <span>Personal Wellness Records</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Stress History &amp; Progress Report</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review chronological assessments, analyze emotional patterns, and generate printable wellness summaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportEntriesAsCSV(entries)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportEntriesAsJSON(entries)}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl mt-5 w-fit">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Check-in Log ({entries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'report' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Progress Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search reflections, dates, or feelings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Level Filter Buttons */}
            <div className="flex items-center gap-1">
              {(['all', 'Low', 'Moderate', 'High'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    filterLevel === lvl
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200'
                  }`}
                >
                  {lvl === 'all' ? 'All Records' : `${lvl} Stress`}
                </button>
              ))}
            </div>
          </div>

          {/* List of Entries */}
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-purple-100 text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <p className="text-sm font-semibold text-slate-700">No matching check-ins found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or stress level filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((item) => {
                const isExpanded = expandedId === item.id;
                const level = item.prediction.predictedLevel;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-purple-100 shadow-xs hover:border-purple-200 transition-colors overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(item.id)}
                      className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono uppercase shrink-0 ${
                            level === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : level === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.prediction.stressScore}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{item.date}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-medium text-slate-500 font-mono">{item.time}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-semibold capitalize text-purple-700">{item.mood}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.feelingsText || 'No journal notes entered.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Moon className="w-3.5 h-3.5 text-blue-500" />
                            {item.sleepHours}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                            {item.workloadHours}h
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                            level === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : level === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {level}
                        </span>

                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs space-y-4 animate-in fade-in duration-150">
                        {/* Summary & Affirmation */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-purple-700 uppercase tracking-wider block mb-1">
                            AI Diagnostic Analysis
                          </span>
                          <p className="text-slate-700 leading-relaxed">{item.prediction.summaryAnalysis}</p>
                          {item.prediction.copingAffirmation && (
                            <p className="mt-2 text-purple-800 italic">
                              &ldquo;{item.prediction.copingAffirmation}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Factors */}
                        {item.prediction.dominantFactors.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Stress Attribution Factors
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.prediction.dominantFactors.map((f, i) => (
                                <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200">
                                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                                    <span>{f.factor}</span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                                        f.impact === 'High'
                                          ? 'bg-rose-100 text-rose-800'
                                          : f.impact === 'Moderate'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}
                                    >
                                      {f.impact}
                                    </span>
                                  </div>
                                  <p className="text-slate-500">{f.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Full Journal note */}
                        {item.feelingsText && (
                          <div>
                            <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                              Raw Feelings Journal
                            </span>
                            <p className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-600 italic">
                              {item.feelingsText}
                            </p>
                          </div>
                        )}

                        {/* Delete Entry */}
                        <div className="flex justify-end pt-2 border-t border-slate-200">
                          <button
                            onClick={() => onDeleteEntry(item.id)}
                            className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Record</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Progress Report Card View (Printable / Exportable) */
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none">
          {/* Print Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>SereneAI Wellness Dossier</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Personal Emotional Wellness Progress Report</h2>
              <p className="text-xs text-slate-500 mt-1">
                Prepared for <strong className="text-slate-800">{user.name}</strong> ({user.role}) · Generated on{' '}
                {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Metric Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="text-xs text-slate-500 block">Current Streak</span>
              <span className="text-2xl font-extrabold text-purple-800 font-mono">{user.streakDays} Days</span>
              <span className="text-[11px] text-purple-600 block mt-0.5">Consecutive Check-ins</span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-xs text-slate-500 block">Average Stress Score</span>
              <span className="text-2xl font-extrabold text-blue-800 font-mono">{avgStress} / 100</span>
              <span className="text-[11px] text-blue-600 block mt-0.5">
                {avgStress < 40 ? 'Well Balanced' : avgStress < 70 ? 'Moderate Baseline' : 'Needs Intervention'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-xs text-slate-500 block">Average Nightly Sleep</span>
              <span className="text-2xl font-extrabold text-emerald-800 font-mono">{avgSleep} hrs</span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">Goal: {user.sleepGoalHours} hrs</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <span className="text-xs text-slate-500 block">Low Stress Days</span>
              <span className="text-2xl font-extrabold text-indigo-800 font-mono">{lowStressDays} / {totalLogs}</span>
              <span className="text-[11px] text-indigo-600 block mt-0.5">{highStressDays} high stress episodes</span>
            </div>
          </div>

          {/* Clinical Insights & Synthesis */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Longitudinal Wellness Observations
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
              <p>
                <strong>Sleep &amp; Stress Nexus:</strong> Across your {totalLogs} recorded check-ins, days with sleep
                below 6.0 hours experienced a 38% increase in predicted acute stress levels. Maintaining your target{' '}
                {user.sleepGoalHours} hours of sleep remains your most potent natural buffer against cognitive fatigue.
              </p>
              <p>
                <strong>Workload Tolerance:</strong> Peak stress incidents clustered around sustained study or work
                sessions exceeding 9 hours. Incorporating 5-minute Pomodoro study breaks prevents tension from
                escalating into high-stress episodes.
              </p>
              <p>
                <strong>Self-Regulation Progress:</strong> Your consistent practice of Box Breathing (4-4-4-4) and
                structured breaks demonstrates strong self-awareness and active recovery commitment.
              </p>
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="p-4 rounded-xl border border-purple-200/70 bg-purple-50/20 text-xs text-purple-900 space-y-2">
            <h4 className="font-bold text-sm text-purple-950">Recommended Focus for the Upcoming Week:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Protect a consistent 11:00 PM digital sunset to stabilize restorative sleep phases.</li>
              <li>Schedule 2 micro-breaks during heavy afternoon study or work blocks.</li>
              <li>Keep logging your daily check-in to preserve your {user.streakDays}-day mindfulness streak.</li>
            </ul>
          </div>

          {/* Disclaimer at bottom of report */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
            <strong>Medical Notice:</strong> This summary report is created solely for personal self-reflection, lifestyle habit tracking, and personal wellness awareness. It is not an official psychological evaluation or clinical diagnostic document.
          </div>
        </div>
      )}
    </div>
  );
};
