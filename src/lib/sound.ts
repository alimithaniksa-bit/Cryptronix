/**
 * Professional trading audio indicator engine using Web Audio API on the client.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playAlert() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // Double high-pitch chime
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    
    osc.frequency.setValueAtTime(880, now); // A5 note
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.55);

    // Second wave chime
    setTimeout(() => {
      this.initCtx();
      if (!this.ctx) return;
      const osc2 = this.ctx.createOscillator();
      const gainNode2 = this.ctx.createGain();
      osc2.connect(gainNode2);
      gainNode2.connect(this.ctx.destination);
      osc2.frequency.setValueAtTime(1046.50, this.ctx.currentTime); // C6 note
      gainNode2.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      osc2.start();
      osc2.stop(this.ctx.currentTime + 0.6);
    }, 120);
  }

  playSuccessChime() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio)
    
    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      gain.gain.setValueAtTime(0, now + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);
      
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.35);
    });
  }

  playStopLossHit() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // Low buzz
    osc.frequency.linearRampToValueAtTime(110, now + 0.3); // Pitch glide down

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.55);
  }
}

export const soundEngine = new SoundEngine();
