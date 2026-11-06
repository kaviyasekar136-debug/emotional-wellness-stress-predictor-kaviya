import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, ShieldCheck, Heart } from 'lucide-react';
import { UserProfile } from '../types/wellness';
import { DEFAULT_AVATAR } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, currentUser }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState(currentUser.name || 'Elena Vance');
  const [email, setEmail] = useState(currentUser.email || 'elena.vance@university.edu');
  const [role, setRole] = useState<UserProfile['role']>(currentUser.role || 'Student');
  const [sleepGoal, setSleepGoal] = useState<number>(currentUser.sleepGoalHours || 8);
  const [workloadLimit, setWorkloadLimit] = useState<number>(currentUser.workloadLimitHours || 8);
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...currentUser,
      id: mode === 'register' ? `usr_${Date.now()}` : currentUser.id,
      name: name.trim() || 'Wellness Member',
      email: email.trim() || 'member@serenewellness.ai',
      role,
      sleepGoalHours: sleepGoal,
      workloadLimitHours: workloadLimit,
      avatarUrl: currentUser.avatarUrl || DEFAULT_AVATAR,
    };
    onLoginSuccess(updatedUser);
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess(currentUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        {/* Header Tabs */}
        <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50/40 to-blue-50 border-b border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">Account Access</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back to SereneAI' : 'Create Your Wellness Profile'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Access your emotional analytics, personalized AI predictions, and stress history.'
              : 'Set up your daily targets and receive tailored AI relaxation suggestions.'}
          </p>

          <div className="flex items-center gap-1 p-1 bg-white/80 rounded-xl mt-4 border border-purple-100">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                mode === 'login' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                mode === 'register' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Vance"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Primary Focus / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                  >
                    <option value="Student">Student / Academic</option>
                    <option value="Professional">Professional / Corporate</option>
                    <option value="Educator">Educator / Teacher</option>
                    <option value="Caregiver">Caregiver / Healthcare</option>
                    <option value="Other">Personal Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Nightly Sleep Goal</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={4}
                      max={12}
                      step={0.5}
                      value={sleepGoal}
                      onChange={(e) => setSleepGoal(parseFloat(e.target.value) || 8)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 font-mono"
                    />
                    <span className="text-xs text-slate-500 shrink-0">hrs</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('For demonstration purposes, password check is bypassable via Instant Demo!')}
                  className="text-xs text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password || (mode === 'login' ? '••••••••' : '')}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs hover:shadow-md transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}
          </button>

          {/* Quick Demo Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-purple-600" />
              <span>Instant Guest Demo Access (Preloaded Trends)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted local storage · No tracking trackers</span>
          </div>
        </form>
      </div>
    </div>
  );
};
