import { DailyCheckIn, UserProfile } from '../types/wellness';

const STORAGE_KEY_USER = 'serene_wellness_user_profile';
const STORAGE_KEY_ENTRIES = 'serene_wellness_checkin_entries';
const STORAGE_KEY_IS_LOGGED_IN = 'serene_wellness_auth_state';

export const DEFAULT_AVATAR = '/src/assets/images/wellness_user_avatar_1793880022425.jpg';
export const DEFAULT_BANNER = '/src/assets/images/wellness_zen_banner_1793880022528.jpg';

export const INITIAL_USER: UserProfile = {
  id: 'usr_default_demo',
  name: 'Elena Vance',
  email: 'elena.vance@university.edu',
  avatarUrl: DEFAULT_AVATAR,
  role: 'Student',
  sleepGoalHours: 8,
  workloadLimitHours: 8,
  streakDays: 6,
  lastCheckInDate: new Date().toISOString().split('T')[0],
  createdAt: '2026-10-28',
};

// Generate realistic seeded history for 7 days preceding today
export function generateInitialHistory(): DailyCheckIn[] {
  const now = new Date();
  const daysOffset = [6, 5, 4, 3, 2, 1, 0];

  const sampleMoods: Array<{
    mood: DailyCheckIn['mood'];
    feelings: string;
    sleep: number;
    quality: DailyCheckIn['sleepQuality'];
    work: number;
    intensity: number;
    stress: number;
    score: number;
    level: DailyCheckIn['prediction']['predictedLevel'];
    summary: string;
    factors: DailyCheckIn['prediction']['dominantFactors'];
  }> = [
    {
      mood: 'calm',
      feelings: 'Finished midterm paper early. Went for an evening stroll around the botanical gardens.',
      sleep: 8.0,
      quality: 'Restful',
      work: 6.5,
      intensity: 4,
      stress: 3,
      score: 28,
      level: 'Low',
      summary: 'Optimal restorative balance observed. Generous sleep and deliberate physical activity suppressed cortisol markers.',
      factors: [
        { factor: 'Adequate Sleep', impact: 'Low', description: '8.0h sleep bolstered cognitive stamina.' },
        { factor: 'Paced Workload', impact: 'Low', description: 'Manageable academic obligations.' },
      ],
    },
    {
      mood: 'joyful',
      feelings: 'Group project presentation went amazingly well! Celebrated with matcha with classmates.',
      sleep: 7.5,
      quality: 'Restful',
      work: 7.0,
      intensity: 5,
      stress: 2,
      score: 22,
      level: 'Low',
      summary: 'Positive emotional resonance bolstered baseline resilience. Highly positive valence and restful sleep.',
      factors: [
        { factor: 'Social Bonding', impact: 'Low', description: 'Elevated subjective well-being through team success.' },
        { factor: 'Solid Sleep Architecture', impact: 'Low', description: '7.5h restorative sleep.' },
      ],
    },
    {
      mood: 'tired',
      feelings: 'Stayed up watching lectures late. Woke up slightly groggy with mild neck stiffness.',
      sleep: 5.5,
      quality: 'Moderate',
      work: 8.5,
      intensity: 6,
      stress: 5,
      score: 52,
      level: 'Moderate',
      summary: 'Early sleep debt observed (5.5h). Workload intensity is manageable but cognitive freshness was dampened.',
      factors: [
        { factor: 'Sleep Deficit', impact: 'Moderate', description: '5.5h is below personal 8.0h target.' },
        { factor: 'Screen Eye Fatigue', impact: 'Moderate', description: 'Late night digital lecture viewing.' },
      ],
    },
    {
      mood: 'anxious',
      feelings: 'Upcoming biochemistry exam deadline looming. Feeling pressure to cover 4 remaining chapters.',
      sleep: 5.0,
      quality: 'Restless',
      work: 10.0,
      intensity: 8,
      stress: 8,
      score: 76,
      level: 'High',
      summary: 'Acute academic stress surge detected. 10 hours of intense study paired with 5 hours of broken sleep triggers elevated nervous strain.',
      factors: [
        { factor: 'Academic Workload Surge', impact: 'High', description: '10h intense exam preparation.' },
        { factor: 'Sleep Deprivation', impact: 'High', description: '5.0h restless sleep impairs memory consolidation.' },
        { factor: 'Emotional Anticipation', impact: 'High', description: 'Heightened performance anxiety.' },
      ],
    },
    {
      mood: 'overwhelmed',
      feelings: 'Lab report revisions plus assignment submission due on same afternoon. Heart was beating fast.',
      sleep: 4.8,
      quality: 'Restless',
      work: 11.0,
      intensity: 9,
      stress: 9,
      score: 84,
      level: 'High',
      summary: 'Elevated acute overload. Sympathetic nervous system overdrive evidenced by high workload and restricted recovery.',
      factors: [
        { factor: 'Critical Work Overload', impact: 'High', description: '11h sustained cognitive output.' },
        { factor: 'Severe Sleep Deficit', impact: 'High', description: 'Under 5h restorative sleep.' },
      ],
    },
    {
      mood: 'calm',
      feelings: 'Took an intentional slow morning after the exam. Practiced 15 minutes of box breathing and stretched.',
      sleep: 9.0,
      quality: 'Restful',
      work: 4.0,
      intensity: 3,
      stress: 3,
      score: 32,
      level: 'Low',
      summary: 'Strong physiological rebound. 9 hours of restorative sleep initiated significant nervous system recovery.',
      factors: [
        { factor: 'Recovery Sleep', impact: 'Low', description: '9.0h deep rest restored mental reserves.' },
        { factor: 'Breathing Grounding', impact: 'Low', description: 'Intentional somatic reset calmed heart rate.' },
      ],
    },
    {
      mood: 'calm',
      feelings: 'Steady day catching up on light reading. Made homemade soup and stayed hydrated.',
      sleep: 7.8,
      quality: 'Restful',
      work: 6.0,
      intensity: 4,
      stress: 3,
      score: 29,
      level: 'Low',
      summary: 'Equilibrium maintained. Healthy hydration, reasonable cognitive load, and regular sleep cycle.',
      factors: [
        { factor: 'Consistent Sleep Rhythm', impact: 'Low', description: '7.8h restful night.' },
        { factor: 'Balanced Workload', impact: 'Low', description: 'Paced daily tasks.' },
      ],
    },
  ];

  return daysOffset.map((offset, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    const dateStr = d.toISOString().split('T')[0];
    const s = sampleMoods[idx % sampleMoods.length];

    return {
      id: `chk_${dateStr}_${idx}`,
      date: dateStr,
      time: '19:30',
      timestamp: d.getTime(),
      mood: s.mood,
      feelingsText: s.feelings,
      sleepHours: s.sleep,
      sleepQuality: s.quality,
      workloadHours: s.work,
      workloadIntensity: s.intensity,
      selfReportedStress: s.stress,
      physicalActivityMinutes: s.score > 60 ? 10 : 35,
      caffeineCups: s.score > 60 ? 4 : 2,
      waterGlasses: s.score > 60 ? 4 : 7,
      prediction: {
        predictedLevel: s.level,
        stressScore: s.score,
        confidence: 0.92,
        dominantFactors: s.factors,
        sentimentScore: s.score > 60 ? -0.7 : 0.6,
        summaryAnalysis: s.summary,
        recommendedRoutines: [
          {
            title: s.level === 'High' ? 'Box Breathing (4-4-4-4)' : 'Coherence Flow (5-5)',
            category: 'Breathing',
            durationMinutes: 5,
            description: 'Calming autonomic nervous system reset routine.',
            actionableSteps: ['Inhale smoothly', 'Hold with ease', 'Slow complete exhale', 'Repeat 4 cycles'],
          },
          {
            title: '5-Minute Mindful Study Break',
            category: 'Study Break',
            durationMinutes: 5,
            description: 'Step away from screen, drink water, and gaze into distance.',
            actionableSteps: ['Stand up and roll shoulders', 'Sip warm water', 'Rest eyes from blue light'],
          },
        ],
        copingAffirmation: 'One mindful breath at a time restores clarity and perspective.',
        urgencyFlag: s.score >= 82,
        engineUsed: 'Gemini 3.8 Flash',
      },
    };
  });
}

// LocalStorage helpers
export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed reading user profile from localStorage:', err);
  }
  return INITIAL_USER;
}

export function saveUserProfile(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed saving user profile:', err);
  }
}

export function loadCheckInEntries(): DailyCheckIn[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (saved) {
      const parsed: DailyCheckIn[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.timestamp - a.timestamp);
      }
    }
  } catch (err) {
    console.error('Failed loading check-in entries:', err);
  }

  // Pre-seed if fresh
  const initial = generateInitialHistory();
  saveCheckInEntries(initial);
  return initial;
}

export function saveCheckInEntries(entries: DailyCheckIn[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed saving check-in entries:', err);
  }
}

export function saveNewCheckIn(entry: DailyCheckIn): DailyCheckIn[] {
  const current = loadCheckInEntries();
  // Filter out any existing entry on the exact same date if user is re-checking in today
  const filtered = current.filter((item) => item.date !== entry.date);
  const updated = [entry, ...filtered].sort((a, b) => b.timestamp - a.timestamp);
  saveCheckInEntries(updated);

  // Update user streak & last check in
  const profile = loadUserProfile();
  profile.lastCheckInDate = entry.date;
  profile.streakDays = (profile.streakDays || 1) + 1;
  saveUserProfile(profile);

  return updated;
}

export function deleteCheckIn(id: string): DailyCheckIn[] {
  const current = loadCheckInEntries();
  const filtered = current.filter((item) => item.id !== id);
  saveCheckInEntries(filtered);
  return filtered;
}

export function loadAuthState(): boolean {
  if (typeof window === 'undefined') return true;
  const state = localStorage.getItem(STORAGE_KEY_IS_LOGGED_IN);
  return state !== 'false'; // default logged in to demo account
}

export function saveAuthState(isLoggedIn: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, isLoggedIn ? 'true' : 'false');
}

// Export utilities
export function exportEntriesAsCSV(entries: DailyCheckIn[]): void {
  const headers = [
    'Date',
    'Time',
    'Mood',
    'Sleep Hours',
    'Sleep Quality',
    'Workload Hours',
    'Workload Intensity (1-10)',
    'Self-Reported Stress (1-10)',
    'Predicted Level',
    'AI Stress Score (0-100)',
    'Confidence',
    'Feelings Journal',
  ];

  const rows = entries.map((e) => [
    `"${e.date}"`,
    `"${e.time}"`,
    `"${e.mood}"`,
    e.sleepHours,
    `"${e.sleepQuality}"`,
    e.workloadHours,
    e.workloadIntensity,
    e.selfReportedStress,
    `"${e.prediction.predictedLevel}"`,
    e.prediction.stressScore,
    `${Math.round(e.prediction.confidence * 100)}%`,
    `"${(e.feelingsText || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `emotional_wellness_history_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportEntriesAsJSON(entries: DailyCheckIn[]): void {
  const dataStr = JSON.stringify(entries, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `serene_wellness_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
