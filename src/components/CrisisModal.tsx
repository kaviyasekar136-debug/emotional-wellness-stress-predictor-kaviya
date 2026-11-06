import React from 'react';
import { X, PhoneCall, MessageSquare, Globe, HeartHandshake, ShieldAlert } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-dialog-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-purple-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h2 id="crisis-dialog-title" className="text-lg font-semibold text-slate-900">
                Crisis Support &amp; Mental Health Helplines
              </h2>
              <p className="text-xs text-slate-500">
                Immediate, free, confidential 24/7 human support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-4 bg-purple-50/70 border border-purple-200/60 rounded-xl text-xs text-purple-900 leading-relaxed">
            <strong>Important Medical Disclaimer:</strong> SereneAI is an educational and lifestyle tool designed for personal emotional awareness and stress habit tracking. It is <em>not</em> a medical diagnostic instrument, psychiatric evaluation, or emergency service. If you are experiencing overwhelming distress or thoughts of self-harm, please reach out to one of the trusted services below right away.
          </div>

          <div className="space-y-3">
            {/* 988 Lifeline */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">988 Suicide &amp; Crisis Lifeline (US &amp; Canada)</h3>
                  <p className="text-xs text-slate-500">Free, confidential 24/7 call and text support in English &amp; Spanish</p>
                </div>
              </div>
              <a
                href="tel:988"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Call or Text 988
              </a>
            </div>

            {/* Crisis Text Line */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Crisis Text Line (US, UK, Canada)</h3>
                  <p className="text-xs text-slate-500">Connect with a trained volunteer crisis counselor via SMS</p>
                </div>
              </div>
              <a
                href="sms:741741?body=HOME"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Text HOME to 741741
              </a>
            </div>

            {/* UK NHS Mental Health */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">NHS Mental Health Services (UK)</h3>
                  <p className="text-xs text-slate-500">For urgent medical &amp; mental health support dial 111 (Free 24/7)</p>
                </div>
              </div>
              <a
                href="tel:111"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Dial 111
              </a>
            </div>

            {/* International Befrienders */}
            <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Befrienders Worldwide</h3>
                  <p className="text-xs text-slate-500">Global directory of certified emotional support centers worldwide</p>
                </div>
              </div>
              <a
                href="https://www.befrienders.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Find Local Center
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>You are not alone. Caring help is available anytime.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
