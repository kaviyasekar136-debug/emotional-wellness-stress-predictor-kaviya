// Gentle harmonic chime generator for breathing & mindfulness pacer using Web Audio API
class MindfulnessAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft, resonant meditation chime (e.g., 432Hz or 528Hz harmonics)
  playChime(type: 'inhale' | 'hold' | 'exhale' | 'complete') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = 528; // Solfeggio frequency for transformation & peace
      let duration = 1.6;

      if (type === 'inhale') {
        freq = 432; // Calming frequency
        duration = 1.4;
      } else if (type === 'hold') {
        freq = 396; // Grounding frequency
        duration = 1.0;
      } else if (type === 'exhale') {
        freq = 320; // Releasing frequency
        duration = 1.8;
      } else if (type === 'complete') {
        freq = 639; // Heart resonance
        duration = 2.4;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Add gentle overtone for singing-bowl feel
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.04, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio playback silently catches if user interaction not yet registered
    }
  }
}

export const mindfulnessAudio = new MindfulnessAudio();
