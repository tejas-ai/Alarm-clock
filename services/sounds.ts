
class SoundService {
  private ctx: AudioContext | null = null;
  private activeAlarmLayer: { source: AudioBufferSourceNode | OscillatorNode, gain: GainNode, name: string } | null = null;
  private activePreviewLayer: { source: AudioBufferSourceNode | OscillatorNode, gain: GainNode, name: string } | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private async decodeAudio(dataUrl: string): Promise<AudioBuffer> {
    if (this.bufferCache.has(dataUrl)) return this.bufferCache.get(dataUrl)!;

    this.init();
    const response = await fetch(dataUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
    
    this.bufferCache.set(dataUrl, audioBuffer);
    return audioBuffer;
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playTick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /**
   * Internal method to play a sound on a specific layer with crossfading.
   */
  private async playOnLayer(
    layerName: 'alarm' | 'preview',
    sound: { name: string; url?: string },
    targetVolume: number,
    fadeDuration: number = 0.8
  ) {
    this.init();
    const now = this.ctx!.currentTime;
    const layer = layerName === 'alarm' ? this.activeAlarmLayer : this.activePreviewLayer;

    // Prevent re-triggering the exact same sound if already playing at high volume
    if (layer && layer.name === sound.name && layerName === 'alarm') {
      this.setVolume(targetVolume, layerName);
      return;
    }

    // Fade out previous source on this layer
    if (layer) {
      const oldLayer = layer;
      oldLayer.gain.gain.setTargetAtTime(0.001, now, fadeDuration / 3);
      setTimeout(() => {
        try { (oldLayer.source as any).stop(); } catch(e) {}
      }, fadeDuration * 1000 + 100);
    }

    // Initialize new Gain Node for the layer
    const newGain = this.ctx!.createGain();
    newGain.gain.setValueAtTime(0.001, now);
    newGain.gain.linearRampToValueAtTime(Math.max(0.001, targetVolume), now + fadeDuration);
    newGain.connect(this.ctx!.destination);

    let newSource: AudioBufferSourceNode | OscillatorNode;

    if (sound.url) {
      try {
        const buffer = await this.decodeAudio(sound.url);
        const source = this.ctx!.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        newSource = source;
      } catch (e) {
        console.error("Audio decoding failed, falling back to procedural", e);
        return this.playOnLayer(layerName, { name: 'Classic Bell' }, targetVolume, fadeDuration);
      }
    } else {
      const osc = this.ctx!.createOscillator();
      switch (sound.name) {
        case 'Digital Pulse':
          osc.type = 'square';
          osc.frequency.value = 440;
          break;
        case 'Zen Garden':
          osc.type = 'sine';
          osc.frequency.value = 180;
          break;
        case 'Summer Rain':
          osc.type = 'triangle';
          osc.frequency.value = 120;
          break;
        case 'Classic Bell':
        default:
          osc.type = 'triangle';
          osc.frequency.value = 320;
          break;
      }
      newSource = osc;
    }

    const newLayerState = { source: newSource, gain: newGain, name: sound.name };
    if (layerName === 'alarm') this.activeAlarmLayer = newLayerState;
    else this.activePreviewLayer = newLayerState;

    newSource.connect(newGain);
    newSource.start();
  }

  async playAlarmSound(sound: { name: string; url?: string }, volume: number = 1.0) {
    return this.playOnLayer('alarm', sound, volume, 1.5);
  }

  async playPreview(sound: { name: string; url?: string }, volume: number = 0.5) {
    return this.playOnLayer('preview', sound, volume, 0.5);
  }

  setVolume(volume: number, layer: 'alarm' | 'preview' = 'alarm') {
    const target = layer === 'alarm' ? this.activeAlarmLayer : this.activePreviewLayer;
    if (target && this.ctx) {
      target.gain.gain.setTargetAtTime(Math.max(0.001, volume), this.ctx.currentTime, 0.2);
    }
  }

  stopAll(fadeTime: number = 1.0) {
    const layers = [this.activeAlarmLayer, this.activePreviewLayer];
    layers.forEach((layer, idx) => {
      if (layer && this.ctx) {
        const now = this.ctx.currentTime;
        layer.gain.gain.linearRampToValueAtTime(0.001, now + fadeTime);
        setTimeout(() => {
          try { (layer.source as any).stop(); } catch(e) {}
        }, fadeTime * 1000 + 100);
      }
    });
    this.activeAlarmLayer = null;
    this.activePreviewLayer = null;
  }
}

export const sounds = new SoundService();
