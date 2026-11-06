export type MoodType =
  | 'joyful'
  | 'calm'
  | 'neutral'
  | 'tired'
  | 'anxious'
  | 'overwhelmed'
  | 'frustrated'
  | 'sad';

export type StressLevel = 'Low' | 'Moderate' | 'High';

export interface RoutineItem {
  title: string;
  category: 'Breathing' | 'Study Break' | 'Relaxation' | 'Healthy Routine';
  durationMinutes: number;
  description: string;
  actionableSteps: string[];
}

export interface FactorItem {
  factor: string;
  impact: 'High' | 'Moderate' | 'Low';
  description: string;
}

export interface PredictionData {
  predictedLevel: StressLevel;
  stressScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  dominantFactors: FactorItem[];
  sentimentScore: number; // -1.0 to 1.0
  summaryAnalysis: string;
  recommendedRoutines: RoutineItem[];
  copingAffirmation: string;
  urgencyFlag: boolean;
  engineUsed: string;
}

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  timestamp: number;
  mood: MoodType;
  feelingsText: string;
  sleepHours: number;
  sleepQuality: 'Restful' | 'Moderate' | 'Restless';
  workloadHours: number;
  workloadIntensity: number; // 1-10
  selfReportedStress: number; // 1-10
  physicalActivityMinutes: number;
  caffeineCups: number;
  waterGlasses: number;
  prediction: PredictionData;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Student' | 'Professional' | 'Educator' | 'Caregiver' | 'Other';
  sleepGoalHours: number;
  workloadLimitHours: number;
  streakDays: number;
  lastCheckInDate?: string;
  createdAt: string;
}
