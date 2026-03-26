/**
 * Audio System — District 05 Surveillance
 * Uses Web Audio API to generate professional notification tones.
 * No external audio files required.
 * FIREBASE INTEGRATION POINT — Audio triggers from Firestore realtime event listeners
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function tone(frequency, duration, type = 'sine', volume = 0.07, delay = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

export const Audio = {
  /** PRIO 1 — Urgent triple beep, high pitch */
  incidentP1: () => {
    tone(1047, 0.12, 'square', 0.07, 0);
    tone(1047, 0.12, 'square', 0.07, 0.18);
    tone(1319, 0.28, 'square', 0.08, 0.36);
  },

  /** PRIO 2 — Double beep, medium pitch */
  incidentP2: () => {
    tone(698, 0.18, 'sine', 0.06, 0);
    tone(698, 0.18, 'sine', 0.06, 0.28);
  },

  /** PRIO 3 — Single soft tone */
  incidentP3: () => {
    tone(523, 0.3, 'sine', 0.05, 0);
  },

  /** Inkomende 112 melding — urgent pattern */
  call112: () => {
    for (let i = 0; i < 3; i++) {
      tone(880, 0.1, 'square', 0.07, i * 0.38);
      tone(660, 0.1, 'square', 0.06, i * 0.38 + 0.15);
    }
  },

  /** Dispatch bevestiging */
  dispatch: () => {
    tone(440, 0.08, 'sine', 0.05, 0);
    tone(554, 0.08, 'sine', 0.05, 0.1);
    tone(659, 0.2, 'sine', 0.06, 0.2);
  },

  /** Status wissel bevestiging */
  statusChange: () => {
    tone(392, 0.1, 'sine', 0.04, 0);
    tone(523, 0.15, 'sine', 0.04, 0.12);
  },

  /** Bericht ontvangen */
  message: () => {
    tone(659, 0.1, 'sine', 0.05, 0);
    tone(784, 0.15, 'sine', 0.05, 0.12);
  },
};