/**
 * Audio Manager for operational sounds
 * Uses Web Audio API for reliable playback
 */

class AudioManager {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
  }

  getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Generate a beep tone
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = type;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  // Incoming 112 call
  playIncomingCall() {
    if (!this.enabled) return;
    this.playTone(880, 0.15, 'sine', 0.4);
    setTimeout(() => this.playTone(880, 0.15, 'sine', 0.4), 200);
    setTimeout(() => this.playTone(1100, 0.3, 'sine', 0.4), 400);
  }

  // Dispatch confirmation
  playDispatchConfirm() {
    if (!this.enabled) return;
    this.playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(800, 0.15, 'sine', 0.2), 120);
  }

  // Alert siren (for broadcasts)
  playAlertSiren() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    gain.gain.value = 0.15;

    // Sweep frequency
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1);

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
  }

  // Incident closed
  playIncidentClosed() {
    if (!this.enabled) return;
    this.playTone(500, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(400, 0.2, 'sine', 0.15), 130);
  }
}

// 🔥 Belangrijk: globaal maken
window.audioManager = new AudioManager();