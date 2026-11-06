import React, { useState } from 'react';
import { DailyCheckIn } from '../types/wellness';
import { TrendingUp, BarChart3, PieChart, Activity, Moon, Clock } from 'lucide-react';

interface WellnessChartsProps {
  entries: DailyCheckIn[];
}

export const WellnessCharts: React.FC<WellnessChartsProps> = ({ entries }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [hoveredEntry, setHoveredEntry] = useState<DailyCheckIn | null>(null);

  // Prepare chronological sorted entries
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const displayEntries = timeRange === '7d' ? sortedEntries.slice(-7) : sortedEntries.slice(-30);

  // Compute stats
  const avgStress =
    displayEntries.length > 0
      ? Math.round(displayEntries.reduce((acc, curr) => acc + curr.prediction.stressScore, 0) / displayEntries.length)
      : 0;

  const avgSleep =
    displayEntries.length > 0
      ? (displayEntries.reduce((acc, curr) => acc + curr.sleepHours, 0) / displayEntries.length).toFixed(1)
      : '0.0';

  const avgWorkload =
    displayEntries.length > 0
      ? (displayEntries.reduce((acc, curr) => acc + curr.workloadHours, 0) / displayEntries.length).toFixed(1)
      : '0.0';

  // Mood frequency count
  const moodCounts: Record<string, number> = {};
  displayEntries.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const moodColors: Record<string, string> = {
    joyful: '#F59E0B',
    calm: '#8B5CF6',
    neutral: '#94A3B8',
    tired: '#60A5FA',
    anxious: '#F97316',
    overwhelmed: '#EF4444',
    frustrated: '#EC4899',
    sad: '#6366F1',
  };

  // SVG Trend Chart dimensions
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const points = displayEntries.map((e, index) => {
    const x =
      displayEntries.length === 1
        ? chartWidth / 2
        : paddingX + (index / (displayEntries.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - (e.prediction.stressScore / 100) * usableHeight;
    return { x, y, entry: e };
  });

  const pathD =
    points.length > 0
      ? points.reduce(
          (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
          ''
        )
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
          chartHeight - paddingY
        } Z`
      : '';

  return (
    <div className="space-y-6">
      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Stress Index</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{avgStress}</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  avgStress < 40
                    ? 'text-emerald-700 bg-emerald-50'
                    : avgStress < 70
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {avgStress < 40 ? 'Low' : avgStress < 70 ? 'Moderate' : 'High'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Sleep</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{avgSleep}</span>
              <span className="text-xs text-slate-400">hrs / night</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Workload</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{avgWorkload}</span>
              <span className="text-xs text-slate-400">hrs / day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Trend Chart */}
      <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Emotional Wellness &amp; Stress Trendline</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily predicted stress trajectory across time with clinical classification bands.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeRange === '7d' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeRange === '30d' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>

        {/* Responsive SVG Graphic */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[580px] h-auto overflow-visible select-none"
          >
            <defs>
              {/* Gradient for area fill */}
              <linearGradient id="stressAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Reference Bands */}
            {/* High Stress Band (> 68) */}
            <rect
              x={paddingX}
              y={paddingY}
              width={usableWidth}
              height={usableHeight * 0.32}
              fill="#fee2e2"
              fillOpacity="0.35"
            />
            {/* Moderate Stress Band (38 - 68) */}
            <rect
              x={paddingX}
              y={paddingY + usableHeight * 0.32}
              width={usableWidth}
              height={usableHeight * 0.30}
              fill="#fef3c7"
              fillOpacity="0.30"
            />
            {/* Low Stress Band (< 38) */}
            <rect
              x={paddingX}
              y={paddingY + usableHeight * 0.62}
              width={usableWidth}
              height={usableHeight * 0.38}
              fill="#ecfdf5"
              fillOpacity="0.45"
            />

            {/* Threshold Guideline Dashes */}
            <line
              x1={paddingX}
              y1={paddingY + usableHeight * 0.32}
              x2={chartWidth - paddingX}
              y2={paddingY + usableHeight * 0.32}
              stroke="#f87171"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text x={paddingX + 4} y={paddingY + usableHeight * 0.32 - 4} fontSize="9" fill="#ef4444" fontWeight="600">
              High Threshold (68)
            </text>

            <line
              x1={paddingX}
              y1={paddingY + usableHeight * 0.62}
              x2={chartWidth - paddingX}
              y2={paddingY + usableHeight * 0.62}
              stroke="#fbbf24"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text x={paddingX + 4} y={paddingY + usableHeight * 0.62 - 4} fontSize="9" fill="#d97706" fontWeight="600">
              Moderate Threshold (38)
            </text>

            {/* Area & Line */}
            {areaD && <path d={areaD} fill="url(#stressAreaGradient)" />}
            {pathD && <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />}

            {/* Data Points */}
            {points.map((p, i) => {
              const isHovered = hoveredEntry?.id === p.entry.id;
              const level = p.entry.prediction.predictedLevel;
              const pointColor = level === 'High' ? '#ef4444' : level === 'Moderate' ? '#f59e0b' : '#10b981';

              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 7 : 5}
                    fill="#ffffff"
                    stroke={pointColor}
                    strokeWidth={isHovered ? 3.5 : 2.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredEntry(p.entry)}
                  />
                  {/* Date label at bottom */}
                  <text
                    x={p.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    className="font-mono"
                  >
                    {p.entry.date.slice(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Tooltip Details Panel */}
        <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs min-h-[46px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {hoveredEntry ? (
            <>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{hoveredEntry.date}:</span>
                <span className="capitalize font-medium text-purple-700">Mood: {hoveredEntry.mood}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">Sleep: {hoveredEntry.sleepHours}h</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">Workload: {hoveredEntry.workloadHours}h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Score: {hoveredEntry.prediction.stressScore}/100</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    hoveredEntry.prediction.predictedLevel === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : hoveredEntry.prediction.predictedLevel === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {hoveredEntry.prediction.predictedLevel}
                </span>
              </div>
            </>
          ) : (
            <span className="text-slate-500 italic">
              Hover over any point on the graph above to inspect date, sleep duration, and clinical AI predictions.
            </span>
          )}
        </div>
      </div>

      {/* Secondary Graphs Grid: Mood Distribution & Sleep Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Emotional Valence Distribution</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Proportion of recorded moods across the active timeframe.
          </p>

          <div className="space-y-3">
            {Object.entries(moodCounts).map(([mKey, count]) => {
              const pct = Math.round((count / displayEntries.length) * 100);
              const color = moodColors[mKey] || '#8b5cf6';
              return (
                <div key={mKey}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="capitalize font-medium text-slate-700">{mKey}</span>
                    <span className="font-mono text-slate-500">
                      {count} {count === 1 ? 'day' : 'days'} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleep vs Stress Correlation */}
        <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Sleep Duration vs. Stress Level</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Notice how nights with under 6.5 hours of sleep directly correspond to elevated stress peaks.
          </p>

          <div className="space-y-2.5">
            {displayEntries.slice(-5).map((e) => (
              <div
                key={e.id}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-medium text-slate-600 w-16">{e.date.slice(5)}</span>
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-mono text-slate-700">{e.sleepHours}h sleep</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Stress:</span>
                  <span
                    className={`font-mono font-bold ${
                      e.prediction.stressScore >= 68
                        ? 'text-rose-600'
                        : e.prediction.stressScore >= 38
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {e.prediction.stressScore}/100
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      e.prediction.predictedLevel === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : e.prediction.predictedLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {e.prediction.predictedLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
