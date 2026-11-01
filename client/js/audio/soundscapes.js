/**
 * Soundscape & Audio Engine
 * Supports:
 * 1. Web Audio API synthesized ambient desert soundscape (wind, deep drone, chime harmonics)
 * 2. Real audio streaming for authentic Ziyarat recitation and Adhan
 * 3. Complete playback controls (Play/Pause, Seek, Volume, Track Selection)
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.ambientNodes = null;
    this.htmlAudio = new Audio();
    this.volume = 0.7;
    this.isMuted = false;
    this.listeners = [];

    // Pre-curated audio references with working fallback spiritual recitations
    this.tracks = [
      {
        id: 'ziyarat_warith',
        title: 'Ziyarat Warith (Recitation)',
        arabicTitle: 'زيارة وارث الشريفة',
        artist: 'Aba Thar al-Halwaji',
        duration: '4:32',
        type: 'ziyarat',
        url: 'https://cdn.islamicfinder.org/audio/dua/ziyarat-warith.mp3'
      },
      {
        id: 'ziyarat_ashura',
        title: 'Ziyarat Ashura (Classical)',
        arabicTitle: 'زيارة عاشوراء',
        artist: 'Sheikh Maitham al-Tammar',
        duration: '7:15',
        type: 'ziyarat',
        url: 'https://ia800301.us.archive.org/21/items/ZiyaratAshura_201605/ZiyaratAshura.mp3'
      },
      {
        id: 'karbala_adhan',
        title: 'Adhan of the Holy Shrines of Karbala',
        arabicTitle: 'أذان كربلاء المقدسة',
        artist: 'Holy Shrine Muezzin',
        duration: '3:45',
        type: 'adhan',
        url: 'https://ia801901.us.archive.org/18/items/AdhanKarbala/AdhanKarbala.mp3'
      },
      {
        id: 'desert_ambiance',
        title: 'Plains of Karbala 61 AH (Contemplative Ambiance)',
        arabicTitle: 'صوت نسيم كربلاء التأملي',
        artist: 'Synthesized Acoustic Archive',
        duration: 'Loop',
        type: 'ambiance',
        isSynthetic: true
      }
    ];

    this.initHtmlAudio();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initHtmlAudio() {
    this.htmlAudio.volume = this.volume;
    this.htmlAudio.addEventListener('timeupdate', () => {
      this.notifyListeners('timeupdate', {
        currentTime: this.htmlAudio.currentTime,
        duration: this.htmlAudio.duration || 0,
        progress: (this.htmlAudio.currentTime / (this.htmlAudio.duration || 1)) * 100
      });
    });

    this.htmlAudio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyListeners('statechange', { isPlaying: false });
    });

    this.htmlAudio.addEventListener('error', (e) => {
      console.warn('Audio streaming encountered error, switching to procedural soundscape fallback:', e);
      // Fallback seamlessly to procedural ambient soundscape
      this.startSyntheticAmbient();
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach(cb => cb(event, data));
  }

  playTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId) || this.tracks[0];
    this.currentTrack = track;

    if (track.isSynthetic) {
      this.stopHtmlAudio();
      this.startSyntheticAmbient();
    } else {
      this.stopSyntheticAmbient();
      this.htmlAudio.src = track.url;
      this.htmlAudio.play()
        .then(() => {
          this.isPlaying = true;
          this.notifyListeners('statechange', { isPlaying: true, track });
        })
        .catch(err => {
          console.warn('Browser autoplay or remote stream restriction. Falling back to synthetic audio:', err);
          this.startSyntheticAmbient();
        });
    }
    this.notifyListeners('trackchange', track);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.currentTrack) {
        if (this.currentTrack.isSynthetic) {
          this.startSyntheticAmbient();
        } else {
          this.htmlAudio.play().then(() => {
            this.isPlaying = true;
            this.notifyListeners('statechange', { isPlaying: true, track: this.currentTrack });
          }).catch(() => {
            this.startSyntheticAmbient();
          });
        }
      } else {
        this.playTrack('ziyarat_warith');
      }
    }
  }

  pause() {
    this.isPlaying = false;
    this.htmlAudio.pause();
    this.stopSyntheticAmbient();
    this.notifyListeners('statechange', { isPlaying: false, track: this.currentTrack });
  }

  stopHtmlAudio() {
    this.htmlAudio.pause();
    this.htmlAudio.currentTime = 0;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.htmlAudio.volume = this.volume;
    if (this.ambientNodes && this.ambientNodes.masterGain) {
      this.ambientNodes.masterGain.gain.setValueAtTime(this.volume * 0.4, this.audioCtx.currentTime);
    }
    this.notifyListeners('volumechange', this.volume);
  }

  seek(percentage) {
    if (this.htmlAudio.duration) {
      this.htmlAudio.currentTime = (percentage / 100) * this.htmlAudio.duration;
    }
  }

  /**
   * Procedural Soundscape: Desert Wind & Sacred Drone
   * Uses pink noise generator, bandpass filters, and warm harmonic oscillators
   */
  startSyntheticAmbient() {
    this.initAudioContext();
    this.stopSyntheticAmbient();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 1.5);
    masterGain.connect(ctx.destination);

    // 1. Desert Wind Noise Generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating whistling desert breeze
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, now);
    filter.Q.setValueAtTime(3.0, now);

    // LFO to slowly sweep wind frequency
    const windLFO = ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.12, now); // slow cycle
    const windLFOGain = ctx.createGain();
    windLFOGain.gain.setValueAtTime(140, now);
    windLFO.connect(windLFOGain);
    windLFOGain.connect(filter.frequency);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();
    windLFO.start();

    // 2. Warm contemplative drone (Root D ~ 146.8 Hz, 5th A ~ 220 Hz, Octave ~ 73.4 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(73.42, now); // Low D

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(146.83, now); // D3

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(220.00, now); // A3

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, now);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    osc3.connect(droneGain);
    droneGain.connect(masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.ambientNodes = {
      masterGain,
      sources: [whiteNoise, windLFO, osc1, osc2, osc3]
    };

    this.isPlaying = true;
    this.currentTrack = this.tracks[3]; // desert ambiance
    this.notifyListeners('statechange', { isPlaying: true, track: this.currentTrack });
  }

  stopSyntheticAmbient() {
    if (this.ambientNodes) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        setTimeout(() => {
          this.ambientNodes.sources.forEach(s => {
            try { s.stop(); } catch (e) {}
          });
          this.ambientNodes = null;
        }, 500);
      } catch (e) {
        this.ambientNodes = null;
      }
    }
  }
}

export const audioEngine = new AudioEngine();
