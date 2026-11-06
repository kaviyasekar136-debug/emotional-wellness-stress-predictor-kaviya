/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CheckInForm } from './components/CheckInForm';
import { RelaxationHub } from './components/RelaxationHub';
import { WellnessCharts } from './components/WellnessCharts';
import { HistoryAndReport } from './components/HistoryAndReport';
import { AuthModal } from './components/AuthModal';
import { CrisisModal } from './components/CrisisModal';
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimerBanner';
import {
  loadUserProfile,
  saveUserProfile,
  loadCheckInEntries,
  saveNewCheckIn,
  deleteCheckIn,
} from './utils/storage';
import { DailyCheckIn, UserProfile } from './types/wellness';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [entries, setEntries] = useState<DailyCheckIn[]>(loadCheckInEntries);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState<boolean>(false);

  // Sync state to storage if changed
  const handleCheckInCompleted = (newEntry: DailyCheckIn) => {
    const updatedList = saveNewCheckIn(newEntry);
    setEntries(updatedList);
    // Reload user profile for updated streak
    setUser(loadUserProfile());
  };

  const handleDeleteEntry = (id: string) => {
    const updated = deleteCheckIn(id);
    setEntries(updated);
  };

  const handleLoginSuccess = (updatedUser: UserProfile) => {
    saveUserProfile(updatedUser);
    setUser(updatedUser);
  };

  const handleNavigateToRoutine = (_category: string) => {
    setActiveTab('relaxation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const latestEntry = entries.length > 0 ? entries[0] : null;

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-800 flex flex-col font-sans">
      {/* Top Bar Navigation conforming to the 3-zone Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCrisis={() => setIsCrisisOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            user={user}
            latestEntry={latestEntry}
            entries={entries}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'checkin' && (
          <CheckInForm
            onCheckInCompleted={handleCheckInCompleted}
            onNavigateToRoutine={handleNavigateToRoutine}
          />
        )}

        {activeTab === 'relaxation' && <RelaxationHub />}

        {activeTab === 'charts' && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Interactive Trends &amp; Visualizations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor your daily mood fluctuations, stress trajectories, sleep correlations, and workload dynamics.
              </p>
            </div>
            <WellnessCharts entries={entries} />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryAndReport
            entries={entries}
            user={user}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
      </main>

      {/* Educational & Medical Disclaimer Footer */}
      <MedicalDisclaimerBanner onOpenCrisis={() => setIsCrisisOpen(true)} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={user}
      />

      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />
    </div>
  );
}
