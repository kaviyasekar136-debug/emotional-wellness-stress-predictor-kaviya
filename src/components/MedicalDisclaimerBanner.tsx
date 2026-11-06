import React from 'react';
import { AlertCircle, PhoneCall, ShieldCheck } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  onOpenCrisis: () => void;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({ onOpenCrisis }) => {
  return (
    <footer className="mt-16 border-t border-purple-100 bg-white/80 py-8 px-4 sm:px-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Medical Notice Box */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs tracking-tight">
                Educational &amp; Lifestyle Wellness Notice
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                SereneAI (AI-Based Emotional Wellness &amp; Stress Predictor) is an informational tool built to encourage daily emotional self-reflection, mindfulness, and healthy sleep/workload habits. It is <strong>not a medical diagnostic tool</strong> and does not substitute for qualified clinical evaluation, diagnosis, psychiatric care, or psychotherapy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCrisis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 whitespace-nowrap self-start md:self-center"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Crisis Helplines (988 / 741741)</span>
          </button>
        </div>

        {/* Footer info & copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-2">
          <div className="flex items-center gap-2">
            <span>© 2026 AI-Based Emotional Wellness &amp; Stress Predictor</span>
            <span aria-hidden="true">·</span>
            <span>Privacy-First Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Built with Pastel Lavender &amp; Soft Blue Design</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 AI &amp; Clinical Heuristics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
