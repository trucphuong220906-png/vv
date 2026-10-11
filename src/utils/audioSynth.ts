/**
 * Procedural Web Audio API Synthesizer for Traditional Vietnamese Pentatonic Instruments:
 * - Đàn Tranh / Tranh Điệp
 * - Đàn Bầu (Monochord with bend/vibrato harmonics)
 * - Hát Chèo (Drum percussions & folk scale)
 * - Dân ca Quan Họ / Nhã Nhạc
 */

let sharedAudioCtx: AudioContext | null = null;
let currentStopCallback: (() => void) | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

export const NOTES = {
  C4: 261.63,
  D4: 293.66,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
};

function playTone(freq = NOTES.G4, delay = 0, duration = 1.2) {
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime + delay;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, startTime);
    filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  } catch (err) {
    console.warn('Audio error:', err);
  }
}

export function playVietnameseMelody(
  type: 'dantranh' | 'dongho' | 'danbau' | 'cheo' | 'quanho' | string,
  onEnded?: () => void
): () => void {
  try {
    if (currentStopCallback) {
      currentStopCallback();
    }

    const ctx = getAudioContext();
    const timerIds: number[] = [];

    if (type === 'dantranh' || type === 'dongho') {
      const melody = [
        { f: NOTES.C4, d: 0.15 },
        { f: NOTES.F4, d: 0.35 },
        { f: NOTES.G4, d: 0.55 },
        { f: NOTES.C5, d: 0.78 },
        { f: NOTES.D5, d: 1.0 },
        { f: NOTES.F5, d: 1.25 },
        { f: NOTES.C5, d: 1.55 },
        { f: NOTES.G4, d: 1.95 },
        { f: NOTES.F4, d: 2.35 },
      ];

      melody.forEach(note => {
        playTone(note.f, note.d, 1.8);
      });

      const timer = window.setTimeout(() => {
        if (onEnded) onEnded();
      }, 3500);
      timerIds.push(timer);
    } else if (type === 'danbau') {
      const startTime = ctx.currentTime + 0.1;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const mainGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(NOTES.G4, startTime);
      osc.frequency.exponentialRampToValueAtTime(NOTES.C5, startTime + 0.8);
      osc.frequency.exponentialRampToValueAtTime(NOTES.A4, startTime + 1.6);
      osc.frequency.exponentialRampToValueAtTime(NOTES.G4, startTime + 2.4);

      lfo.frequency.value = 5.5; // vibrato
      lfoGain.gain.value = 6;
      lfo.connect(osc.frequency);

      filter.type = 'bandpass';
      filter.frequency.value = 850;
      filter.Q.value = 2.5;

      mainGain.gain.setValueAtTime(0.01, startTime);
      mainGain.gain.linearRampToValueAtTime(0.28, startTime + 0.15);
      mainGain.gain.exponentialRampToValueAtTime(0.001, startTime + 3);

      osc.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc.start(startTime);
      lfo.start(startTime);
      osc.stop(startTime + 3.1);
      lfo.stop(startTime + 3.1);

      const timer = window.setTimeout(() => {
        if (onEnded) onEnded();
      }, 3200);
      timerIds.push(timer);
    } else if (type === 'cheo') {
      // Drum percussions
      [0.1, 0.45, 0.7, 0.95, 1.3].forEach((d, idx) => {
        const t = ctx.currentTime + d;
        const drumOsc = ctx.createOscillator();
        const drumGain = ctx.createGain();
        drumOsc.type = 'triangle';
        drumOsc.frequency.setValueAtTime(idx % 2 === 0 ? 110 : 160, t);
        drumOsc.frequency.exponentialRampToValueAtTime(45, t + 0.25);
        drumGain.gain.setValueAtTime(0.35, t);
        drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        drumOsc.connect(drumGain);
        drumGain.connect(ctx.destination);
        drumOsc.start(t);
        drumOsc.stop(t + 0.3);
      });

      [NOTES.D5, NOTES.F5, NOTES.G5, NOTES.D5].forEach((f, idx) => {
        playTone(f, 0.4 + idx * 0.35, 1.2);
      });

      const timer = window.setTimeout(() => {
        if (onEnded) onEnded();
      }, 2500);
      timerIds.push(timer);
    } else {
      [NOTES.F4, NOTES.A4, NOTES.C5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.F4].forEach((f, idx) => {
        playTone(f, 0.15 + idx * 0.32, 1.4);
      });
      const timer = window.setTimeout(() => {
        if (onEnded) onEnded();
      }, 3000);
      timerIds.push(timer);
    }

    const stop = () => {
      timerIds.forEach(id => clearTimeout(id));
      if (onEnded) onEnded();
    };

    currentStopCallback = stop;
    return stop;
  } catch (err) {
    console.warn('Audio play error:', err);
    return () => {};
  }
}
