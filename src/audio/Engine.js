import * as Tone from 'tone';

export const wavetables = {
    basic: [
        [1], // Sine
        [1, 0, 0.11, 0, 0.04], // Triangle (approx)
        [1, 0.5, 0.33, 0.25, 0.2, 0.16, 0.14, 0.12], // Saw
        [1, 0, 0.33, 0, 0.2, 0, 0.14, 0, 0.11, 0, 0.09, 0] // Square
    ],
    harmonic: [
        [1], // Pure Sine
        [1, 1, 0, 0, 0, 0], // Octave
        [1, 0.5, 1, 0, 0, 0], // Fifth
        [1, 0.5, 0.33, 1, 0.25, 1] // Noisy
    ]
};

class AudioEngine {
    constructor() {
        this.polySynth = null;
        this.subSynth = null;
        this.noise = null;
        this.noiseEnv = null;
        this.filter = null;
        this.distortion = null;
        this.reverb = null;
        this.delay = null;
        this.lfo = null;
        this.lfoGain = null;
        this.waveform = null;
        this.isStarted = false;
        this.activeNotes = new Set();
        this.currentWT = 'basic';
        this.currentWTPos = 0;
        this.listeners = new Set();
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb());
    }

    async init() {
        if (this.isStarted) return;
        
        await Tone.start();
        
        this.filter = new Tone.Filter({
            frequency: 2000,
            type: 'lowpass',
            rolloff: -12
        }).toDestination();

        this.distortion = new Tone.Distortion(0).connect(this.filter);
        
        this.delay = new Tone.FeedbackDelay({
            delayTime: 0.3,
            feedback: 0.4
        }).connect(this.distortion);
        this.delay.wet.value = 0;

        this.reverb = new Tone.Freeverb({
            roomSize: 0.5,
            dampening: 3000
        }).connect(this.delay);
        this.reverb.wet.value = 0.1;

        this.waveform = new Tone.Waveform(1024);
        Tone.Destination.connect(this.waveform);

        this.polySynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'custom', partials: [1] },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
        }).connect(this.reverb);

        this.subSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'square' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
        }).connect(this.reverb);
        this.subSynth.volume.value = -6;

        this.noise = new Tone.Noise('white').start();
        this.noise.volume.value = -Infinity;

        this.noiseEnv = new Tone.AmplitudeEnvelope({
            attack: 0.1, decay: 0.2, sustain: 0.5, release: 1
        }).connect(this.reverb);
        this.noise.connect(this.noiseEnv);

        this.lfo = new Tone.LFO({ frequency: 1, type: 'sine', min: -1, max: 1 }).start();
        this.lfoGain = new Tone.Gain(0);
        this.lfo.connect(this.lfoGain);

        this.isStarted = true;
        this.updateWavetable();
        this.notify();
    }

    interpolatePartials(pos, table) {
        const frameCount = table.length;
        const scaledPos = pos * (frameCount - 1);
        const frame1Idx = Math.floor(scaledPos);
        const frame2Idx = Math.min(frame1Idx + 1, frameCount - 1);
        const mix = scaledPos - frame1Idx;

        const frame1 = table[frame1Idx];
        const frame2 = table[frame2Idx];
        
        const maxLength = Math.max(frame1.length, frame2.length);
        const result = [];

        for (let i = 0; i < maxLength; i++) {
            const p1 = frame1[i] || 0;
            const p2 = frame2[i] || 0;
            result[i] = p1 + (p2 - p1) * mix;
        }
        return result;
    }

    updateWavetable() {
        if (!this.polySynth) return;
        const partials = this.interpolatePartials(this.currentWTPos, wavetables[this.currentWT]);
        this.polySynth.set({ oscillator: { type: 'custom', partials } });
    }

    playNote(note, subOctave = -2) {
        if (!this.isStarted) return;
        this.activeNotes.add(note);
        this.polySynth.triggerAttack(note);
        const subNote = Tone.Frequency(note).transpose(subOctave * 12).toNote();
        this.subSynth.triggerAttack(subNote);
        if (this.activeNotes.size === 1) this.noiseEnv.triggerAttack();
        this.notify();
    }

    stopNote(note, subOctave = -2) {
        if (!this.isStarted) return;
        this.activeNotes.delete(note);
        this.polySynth.triggerRelease(note);
        const subNote = Tone.Frequency(note).transpose(subOctave * 12).toNote();
        this.subSynth.triggerRelease(subNote);
        if (this.activeNotes.size === 0) this.noiseEnv.triggerRelease();
        this.notify();
    }

    setParam(module, param, value) {
        if (!this.isStarted) return;
        switch (module) {
            case 'osc1':
                if (param === 'wavetable') { this.currentWT = value; this.updateWavetable(); }
                if (param === 'wtPos') { this.currentWTPos = value; this.updateWavetable(); }
                break;
            case 'filter':
                if (param === 'type') this.filter.type = value;
                if (param === 'cutoff') this.filter.frequency.value = value;
                break;
            case 'sub':
                if (param === 'type') this.subSynth.set({ oscillator: { type: value } });
                if (param === 'volume') this.subSynth.volume.value = value === 0 ? -Infinity : Tone.gainToDb(value);
                break;
            case 'noise':
                if (param === 'type') this.noise.type = value;
                if (param === 'volume') this.noise.volume.value = value === 0 ? -Infinity : Tone.gainToDb(value);
                break;
            case 'lfo':
                if (param === 'type') this.lfo.type = value;
                if (param === 'rate') this.lfo.frequency.value = value;
                if (param === 'depth') this.lfoGain.gain.value = value;
                if (param === 'target') {
                    this.lfoGain.disconnect();
                    if (value === 'cutoff') this.lfoGain.connect(this.filter.frequency);
                    if (value === 'pitch') {
                        this.lfoGain.connect(this.polySynth.detune);
                        this.lfoGain.connect(this.subSynth.detune);
                    }
                }
                break;
            case 'env':
                if (param === 'attack') {
                    this.polySynth.set({ envelope: { attack: value } });
                    this.subSynth.set({ envelope: { attack: value } });
                    this.noiseEnv.attack = value;
                }
                if (param === 'release') {
                    this.polySynth.set({ envelope: { release: value } });
                    this.subSynth.set({ envelope: { release: value } });
                    this.noiseEnv.release = value;
                }
                break;
            case 'fx':
                if (param === 'dist') this.distortion.distortion = value;
                if (param === 'reverbMix') this.reverb.wet.value = value;
                if (param === 'delayMix') this.delay.wet.value = value;
                if (param === 'delayTime') this.delay.delayTime.value = value;
                if (param === 'delayFeedback') this.delay.feedback.value = value;
                break;
        }
        this.notify();
    }
}

export const engine = new AudioEngine();
