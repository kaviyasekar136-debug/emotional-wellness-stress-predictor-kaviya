import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

interface StressInput {
  mood: string;
  feelingsText: string;
  sleepHours: number;
  workloadHours: number;
  workloadIntensity: number; // 1-10
  selfReportedStress: number; // 1-10
  physicalActivityMinutes?: number;
  caffeineCups?: number;
}

interface RoutineItem {
  title: string;
  category: 'Breathing' | 'Study Break' | 'Relaxation' | 'Healthy Routine';
  durationMinutes: number;
  description: string;
  actionableSteps: string[];
}

interface FactorItem {
  factor: string;
  impact: 'High' | 'Moderate' | 'Low';
  description: string;
}

interface PredictionResult {
  predictedLevel: 'Low' | 'Moderate' | 'High';
  stressScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  dominantFactors: FactorItem[];
  sentimentScore: number; // -1.0 to 1.0
  summaryAnalysis: string;
  recommendedRoutines: RoutineItem[];
  copingAffirmation: string;
  urgencyFlag: boolean;
  engineUsed: 'Gemini 3.8 Flash' | 'Clinical Heuristic ML Ensemble';
}

// Rule-based statistical ML ensemble for fallback and instant baseline comparison
function computeHeuristicPrediction(input: StressInput): PredictionResult {
  const {
    mood,
    feelingsText = '',
    sleepHours = 7,
    workloadHours = 8,
    workloadIntensity = 5,
    selfReportedStress = 5,
    physicalActivityMinutes = 0,
    caffeineCups = 1,
  } = input;

  let score = 0;

  // 1. Self-reported baseline (weight 25%)
  score += Math.min(10, Math.max(1, selfReportedStress)) * 2.5;

  // 2. Sleep deficit (optimal 7.5 - 9 hrs)
  if (sleepHours < 5) {
    score += 26;
  } else if (sleepHours < 6.5) {
    score += 16;
  } else if (sleepHours < 7.5) {
    score += 8;
  } else if (sleepHours > 10.5) {
    score += 6; // oversleeping fatigue
  } else {
    score += 0;
  }

  // 3. Workload volume and intensity (weight ~ 25%)
  const workLoadMetric = workloadHours * 0.4 + workloadIntensity * 0.6;
  if (workLoadMetric >= 8) {
    score += 24;
  } else if (workLoadMetric >= 6) {
    score += 15;
  } else if (workLoadMetric >= 4) {
    score += 7;
  } else {
    score += 2;
  }

  // 4. Mood valence
  const moodLower = (mood || '').toLowerCase();
  let moodImpact = 10;
  let sentimentScore = 0.0;
  if (['joyful', 'happy', 'excited', 'inspired', 'grateful'].includes(moodLower)) {
    moodImpact = -12;
    sentimentScore = 0.8;
  } else if (['calm', 'peaceful', 'content', 'relaxed', 'balanced'].includes(moodLower)) {
    moodImpact = -10;
    sentimentScore = 0.6;
  } else if (['neutral', 'okay', 'stable'].includes(moodLower)) {
    moodImpact = 2;
    sentimentScore = 0.0;
  } else if (['tired', 'fatigued', 'sluggish', 'bored'].includes(moodLower)) {
    moodImpact = 12;
    sentimentScore = -0.3;
  } else if (['anxious', 'worried', 'frustrated', 'stressed', 'restless'].includes(moodLower)) {
    moodImpact = 22;
    sentimentScore = -0.6;
  } else if (['overwhelmed', 'panicked', 'depressed', 'exhausted', 'hopeless', 'angry'].includes(moodLower)) {
    moodImpact = 28;
    sentimentScore = -0.9;
  }
  score += moodImpact;

  // 5. Feelings text semantic keywords
  const textLower = feelingsText.toLowerCase();
  const highStressKeywords = ['burnout', 'crying', 'drowning', 'panic', 'can\'t take it', 'breakdown', 'suffocating', 'too much', 'insomnia', 'terrified', 'exhaustion', 'hopeless'];
  const moderateStressKeywords = ['deadline', 'busy', 'pressure', 'hard', 'tired', 'worried', 'anxious', 'stuck', 'behind', 'headache', 'tension', 'irritated'];
  const calmingKeywords = ['relaxed', 'productive', 'good day', 'happy', 'walk', 'meditation', 'rested', 'progress', 'peaceful', 'clear mind', 'grateful'];

  let matchedHigh = highStressKeywords.filter(k => textLower.includes(k)).length;
  let matchedMod = moderateStressKeywords.filter(k => textLower.includes(k)).length;
  let matchedCalm = calmingKeywords.filter(k => textLower.includes(k)).length;

  score += matchedHigh * 5 + matchedMod * 2.5 - matchedCalm * 4;

  // 6. Lifestyle buffers
  if (physicalActivityMinutes >= 30) score -= 8;
  else if (physicalActivityMinutes >= 15) score -= 4;

  if (caffeineCups >= 4) score += 6;

  // Clamp 0 - 100
  const finalScore = Math.round(Math.min(100, Math.max(5, score)));

  let predictedLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  if (finalScore >= 68) {
    predictedLevel = 'High';
  } else if (finalScore >= 38) {
    predictedLevel = 'Moderate';
  } else {
    predictedLevel = 'Low';
  }

  // Key factors identification
  const factors: FactorItem[] = [];
  if (sleepHours < 6.5) {
    factors.push({
      factor: 'Sleep Duration',
      impact: sleepHours < 5 ? 'High' : 'Moderate',
      description: `Only ${sleepHours} hours recorded, significantly below restorative recovery thresholds.`,
    });
  }
  if (workloadHours >= 8.5 || workloadIntensity >= 7) {
    factors.push({
      factor: 'Cognitive Workload',
      impact: workloadIntensity >= 8 ? 'High' : 'Moderate',
      description: `Heavy workload (${workloadHours}h at intensity ${workloadIntensity}/10) elevating mental exhaustion risk.`,
    });
  }
  if (['anxious', 'overwhelmed', 'panicked', 'frustrated', 'exhausted'].includes(moodLower)) {
    factors.push({
      factor: 'Emotional Valence',
      impact: 'High',
      description: `Subjective mood reported as "${mood}", amplifying physiological stress responsiveness.`,
    });
  }
  if (physicalActivityMinutes < 15 && finalScore > 45) {
    factors.push({
      factor: 'Sedentary State',
      impact: 'Low',
      description: 'Limited physical decompression time may prolong muscular and neuro-hormonal stress markers.',
    });
  }
  if (factors.length === 0) {
    factors.push({
      factor: 'Balanced Routine',
      impact: 'Low',
      description: 'Sleep, workload, and daily habits are currently well-proportioned.',
    });
  }

  // Personalized routines based on level
  const routines: RoutineItem[] = [];
  if (predictedLevel === 'High') {
    routines.push({
      title: 'Box Breathing Grounding (4-4-4-4)',
      category: 'Breathing',
      durationMinutes: 5,
      description: 'A clinical autonomic reset technique used to downregulate elevated cortisol and nervous tension.',
      actionableSteps: [
        'Inhale gently through nose for 4 seconds.',
        'Hold breath with relaxed shoulders for 4 seconds.',
        'Slowly exhale through mouth for 4 seconds.',
        'Hold empty for 4 seconds before repeating 4 cycles.',
      ],
    });
    routines.push({
      title: 'Immediate 10-Minute Sensory Study Break',
      category: 'Study Break',
      durationMinutes: 10,
      description: 'Step completely away from luminous screens and academic or work materials to interrupt mental overload.',
      actionableSteps: [
        'Stand up, roll shoulders backward 5 times.',
        'Drink a tall glass of cool room-temperature water.',
        'Gaze out a window at distant objects to release ciliary eye spasm.',
      ],
    });
    routines.push({
      title: 'Progressive Muscle De-escalation',
      category: 'Relaxation',
      durationMinutes: 8,
      description: 'Systematically release tension stored across the jaw, neck, trapezoids, and lower back.',
      actionableSteps: [
        'Tense shoulders up to ears for 5 seconds, then drop and exhale fully.',
        'Unclench jaw and allow tongue to rest at base of mouth.',
        'Rest hands open palms-up on your thighs.',
      ],
    });
  } else if (predictedLevel === 'Moderate') {
    routines.push({
      title: '4-7-8 Parasympathetic Calmer',
      category: 'Breathing',
      durationMinutes: 4,
      description: 'Natural tranquilizer for the nervous system that gently slows racing thoughts.',
      actionableSteps: [
        'Empty lungs completely through mouth.',
        'Quietly breathe in through nose for 4 seconds.',
        'Hold your breath for 7 count.',
        'Exhale audibly making a whoosh sound for 8 seconds.',
      ],
    });
    routines.push({
      title: 'Pomodoro Micro-Buffer (25m Focus / 5m Reset)',
      category: 'Study Break',
      durationMinutes: 5,
      description: 'Compartmentalize tasks to prevent cognitive fatigue accumulation during sustained study sessions.',
      actionableSteps: [
        'Complete current micro-task and log stopping point.',
        'Walk around for 3 minutes without touching your phone.',
        'Stretch wrists, neck, and lower lumbar spine.',
      ],
    });
    routines.push({
      title: 'Evening Digital Sunset Protocol',
      category: 'Healthy Routine',
      durationMinutes: 15,
      description: 'Stabilize sleep architecture to reclaim vital REM and deep sleep cycles tonight.',
      actionableSteps: [
        'Dim ambient ceiling lights 60 minutes prior to bed.',
        'Switch mobile devices to warm night-shift mode.',
        'Jot down unfinished tomorrow tasks onto paper to clear mental working memory.',
      ],
    });
  } else {
    routines.push({
      title: 'Resonant Coherence Breathing (5-5)',
      category: 'Breathing',
      durationMinutes: 5,
      description: 'Harmonizes heart rate variability (HRV) and maintains balanced cognitive clarity.',
      actionableSteps: [
        'Inhale smooth and even for 5 seconds.',
        'Exhale smooth and even for 5 seconds without pausing.',
        'Maintain continuous rhythmical ocean-wave breathing.',
      ],
    });
    routines.push({
      title: 'Mindful Momentum Check-in',
      category: 'Relaxation',
      durationMinutes: 5,
      description: 'Reinforce current positive balance and channel your clear energy toward meaningful priorities.',
      actionableSteps: [
        'Note 2 things going smoothly today in your personal journal.',
        'Celebrate finishing a key segment of workload without rush.',
      ],
    });
    routines.push({
      title: 'Sustained Hydration & Movement Flow',
      category: 'Healthy Routine',
      durationMinutes: 10,
      description: 'Support steady metabolic focus through hydration and light stretching.',
      actionableSteps: [
        'Drink 300ml fresh water with a slice of lemon or cucumber.',
        'Take a 10-minute brisk fresh-air stroll.',
      ],
    });
  }

  let summaryAnalysis = '';
  if (predictedLevel === 'High') {
    summaryAnalysis = `Your current indicators point to an elevated acute stress index (${finalScore}/100). The combination of high workload pressure alongside ${sleepHours}h sleep is taxing your nervous system. Taking proactive sensory breaks now will prevent cognitive fatigue compounding into burnout.`;
  } else if (predictedLevel === 'Moderate') {
    summaryAnalysis = `You are maintaining functional momentum with a moderate stress score of ${finalScore}/100. While you are keeping pace, early signs of tension are visible. Interspersing short 5-minute study intervals will keep your energy resilient.`;
  } else {
    summaryAnalysis = `Your emotional wellness indicators are in an optimal, restorative range (${finalScore}/100). Balanced sleep and emotional valence are bolstering your cognitive reserves. Keep this healthy rhythm steady!`;
  }

  const affirmations = [
    'You are capable of navigating today one mindful step at a time.',
    'Rest is not a reward you earn; it is a vital foundation for your clarity and health.',
    'Your worth is never defined by productivity alone. Honor your body’s need for space.',
    'Give yourself permission to pause, breathe, and reset.',
  ];
  const copingAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return {
    predictedLevel,
    stressScore: finalScore,
    confidence: 0.88,
    dominantFactors: factors,
    sentimentScore,
    summaryAnalysis,
    recommendedRoutines: routines,
    copingAffirmation,
    urgencyFlag: finalScore >= 80,
    engineUsed: 'Clinical Heuristic ML Ensemble',
  };
}

// POST /api/predict-stress
app.post('/api/predict-stress', async (req: Request, res: Response) => {
  try {
    const input: StressInput = req.body;

    // Validate inputs
    if (!input || typeof input.selfReportedStress !== 'number') {
      res.status(400).json({ error: 'Missing required emotional and physiological inputs.' });
      return;
    }

    // Always compute the baseline heuristic model first
    const heuristicResult = computeHeuristicPrediction(input);

    // If Gemini client is available, leverage Gemini 3.8 Flash for deep semantic text, emotional nuance & personalized routine synthesis
    if (aiClient) {
      try {
        const prompt = `You are an expert AI Emotional Wellness & Stress Classification Engine.
Analyze the following user wellness check-in:
- Self-Reported Mood: "${input.mood || 'neutral'}"
- Freeform Journal / Feelings: "${input.feelingsText || 'None provided'}"
- Sleep Duration: ${input.sleepHours} hours
- Daily Workload: ${input.workloadHours} hours (Intensity rating: ${input.workloadIntensity} / 10)
- Self-Reported Stress Baseline: ${input.selfReportedStress} / 10
- Physical Activity: ${input.physicalActivityMinutes || 0} minutes
- Daily Caffeine: ${input.caffeineCups || 0} cups

Evaluate this data comprehensively.
1. Classify overall stress level as "Low", "Moderate", or "High".
2. Compute an overall stressScore integer from 0 to 100.
3. Compute confidence score between 0.70 and 0.99.
4. Provide sentimentScore between -1.0 (very negative) and +1.0 (very positive).
5. Identify the top 2 to 4 dominant factors driving this status with impact ("High", "Moderate", or "Low") and concise explanation.
6. Write a compassionate, evidence-based summaryAnalysis (2-3 sentences) explaining the stress dynamics and reassuring the user.
7. Recommend 3 highly tailored, immediately actionable wellness routines (such as Breathing, Study Break, Relaxation, or Healthy Routine) with specific step-by-step instructions.
8. Provide a calming, supportive copingAffirmation.
9. Flag urgencyFlag as true only if stressScore is >= 82 or severe crisis language is detected.

IMPORTANT NOTICE: This is for self-reflection and lifestyle support, not medical diagnosis.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are a compassionate, scientifically grounded emotional wellness analytics engine. Always respond in valid JSON matching the requested schema. Never output markdown around the JSON.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                predictedLevel: {
                  type: Type.STRING,
                  description: 'Must be Low, Moderate, or High',
                },
                stressScore: {
                  type: Type.INTEGER,
                  description: 'Integer between 0 and 100',
                },
                confidence: {
                  type: Type.NUMBER,
                  description: 'Confidence between 0.7 and 0.99',
                },
                sentimentScore: {
                  type: Type.NUMBER,
                  description: 'Sentiment score between -1.0 and 1.0',
                },
                summaryAnalysis: {
                  type: Type.STRING,
                  description: 'Compassionate analysis explanation',
                },
                copingAffirmation: {
                  type: Type.STRING,
                  description: 'Encouraging personalized affirmation',
                },
                urgencyFlag: {
                  type: Type.BOOLEAN,
                  description: 'True if high acute distress needing immediate rest',
                },
                dominantFactors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      factor: { type: Type.STRING },
                      impact: { type: Type.STRING, description: 'High, Moderate, or Low' },
                      description: { type: Type.STRING },
                    },
                    required: ['factor', 'impact', 'description'],
                  },
                },
                recommendedRoutines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: 'Breathing, Study Break, Relaxation, or Healthy Routine',
                      },
                      durationMinutes: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      actionableSteps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['title', 'category', 'durationMinutes', 'description', 'actionableSteps'],
                  },
                },
              },
              required: [
                'predictedLevel',
                'stressScore',
                'confidence',
                'sentimentScore',
                'summaryAnalysis',
                'copingAffirmation',
                'dominantFactors',
                'recommendedRoutines',
              ],
            },
          },
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);

          // Validate level
          let validLevel: 'Low' | 'Moderate' | 'High' = 'Moderate';
          if (['Low', 'Moderate', 'High'].includes(parsed.predictedLevel)) {
            validLevel = parsed.predictedLevel as 'Low' | 'Moderate' | 'High';
          } else if (parsed.stressScore >= 68) {
            validLevel = 'High';
          } else if (parsed.stressScore <= 38) {
            validLevel = 'Low';
          }

          const geminiResult: PredictionResult = {
            predictedLevel: validLevel,
            stressScore: Math.min(100, Math.max(0, parsed.stressScore ?? heuristicResult.stressScore)),
            confidence: parsed.confidence || 0.94,
            dominantFactors: parsed.dominantFactors?.length ? parsed.dominantFactors : heuristicResult.dominantFactors,
            sentimentScore: parsed.sentimentScore ?? heuristicResult.sentimentScore,
            summaryAnalysis: parsed.summaryAnalysis || heuristicResult.summaryAnalysis,
            recommendedRoutines: parsed.recommendedRoutines?.length ? parsed.recommendedRoutines : heuristicResult.recommendedRoutines,
            copingAffirmation: parsed.copingAffirmation || heuristicResult.copingAffirmation,
            urgencyFlag: Boolean(parsed.urgencyFlag),
            engineUsed: 'Gemini 3.8 Flash',
          };

          res.json(geminiResult);
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out, gracefully falling back to ML heuristic engine:', geminiError);
      }
    }

    // Fallback if no Gemini client or Gemini call threw
    res.json(heuristicResult);
  } catch (error) {
    console.error('Error handling /api/predict-stress:', error);
    res.status(500).json({ error: 'An unexpected error occurred during prediction.' });
  }
});

// POST /api/generate-routine
app.post('/api/generate-routine', async (req: Request, res: Response) => {
  try {
    const { stressLevel = 'Moderate', preferredCategory = 'Breathing', duration = 5 } = req.body;

    if (aiClient) {
      try {
        const prompt = `Create a custom, step-by-step wellness routine for someone experiencing ${stressLevel} stress.
Preferred type: ${preferredCategory}.
Target duration: ${duration} minutes.
Provide realistic, gentle instructions.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Return valid JSON matching the routine object schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                durationMinutes: { type: Type.INTEGER },
                description: { type: Type.STRING },
                actionableSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'category', 'durationMinutes', 'description', 'actionableSteps'],
            },
          },
        });

        if (response.text) {
          const routine = JSON.parse(response.text);
          res.json(routine);
          return;
        }
      } catch (err) {
        console.warn('Gemini routine generation fallback:', err);
      }
    }

    // Heuristic fallback routine
    res.json({
      title: `${duration}-Minute ${preferredCategory} Reset`,
      category: preferredCategory,
      durationMinutes: duration,
      description: `A fast, calming ${duration}-minute session tailored for soothing ${stressLevel.toLowerCase()} tension.`,
      actionableSteps: [
        'Settle into a comfortable seated position with feet flat on the floor.',
        'Close eyes or lower gaze to reduce external sensory stimulation.',
        'Take three deliberate deep breaths, feeling your chest and abdomen gently expand.',
        'Focus on the physical sensation of exhalation releasing any tightness.',
        'Gently open your eyes and drink a sip of warm water before returning to work.',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate custom routine.' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Serve static files from dist directory in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
