// Wavetable Definitions (Harmonic Partials)
const wavetables = {
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

let currentWT = 'basic';
let currentWTFrame = 0;

let polySynth;
let subSynth;
let noise;
let noiseEnv;
let filter;
let distortion;
let reverb;
let delay;
let lfo;
let lfoGain;
let lfoTarget = null; // Current target parameter
let waveform;
let isStarted = false;
const startButton = document.getElementById('start-audio');

// Visualizer Setup
const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

// Performance Monitoring
let frameCount = 0;
let lastTime = performance.now();
const fpsElement = document.getElementById('fps-counter');
const voicesElement = document.getElementById('voice-counter');

function updatePerformance() {
    frameCount++;
    const now = performance.now();
    
    if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        fpsElement.innerText = fps;
        
        // Update voice count
        // Note: activeNoteCount is already tracked globally
        voicesElement.innerText = activeNoteCount;
        
        frameCount = 0;
        lastTime = now;
    }
    
    requestAnimationFrame(updatePerformance);
}

// Start performance loop
updatePerformance();

function draw() {
    requestAnimationFrame(draw);
    if (!waveform) return;

    const values = waveform.getValue();
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00d2ff';

    for (let i = 0; i < values.length; i++) {
        const x = (i / values.length) * width;
        const y = ((values[i] + 1) / 2) * height;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

// Initial canvas sizing
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
draw();

// Interpolation Function
function interpolatePartials(pos, table) {
    const frameCount = table.length;
    const scaledPos = pos * (frameCount - 1);
    const frame1Idx = Math.floor(scaledPos);
    const frame2Idx = Math.min(frame1Idx + 1, frameCount - 1);
    const mix = scaledPos - frame1Idx;

    const frame1 = table[frame1Idx];
    const frame2 = table[frame2Idx];
    
    // Find max length to avoid index errors
    const maxLength = Math.max(frame1.length, frame2.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
        const p1 = frame1[i] || 0;
        const p2 = frame2[i] || 0;
        result[i] = p1 + (p2 - p1) * mix;
    }
    return result;
}

function updateWavetable() {
    if (!polySynth) return;
    const pos = parseFloat(document.getElementById('wt-pos').value);
    const partials = interpolatePartials(pos, wavetables[currentWT]);
    
    // PolySynth.set applies to all active and future voices
    polySynth.set({
        oscillator: {
            type: 'custom',
            partials: partials
        }
    });
}

// Initialize Tone.js and Synth components
async function initAudio() {
    if (isStarted) return;
    
    await Tone.start();
    console.log('Audio engine started');
    
    // Create components
    filter = new Tone.Filter({
        frequency: 2000,
        type: 'lowpass',
        rolloff: -12
    });

    // LFO Setup
    lfo = new Tone.LFO({
        frequency: 1,
        type: 'sine',
        min: -1,
        max: 1
    }).start();
    
    lfoGain = new Tone.Gain(0); // Modulation Depth
    lfo.connect(lfoGain);

    distortion = new Tone.Distortion(0).connect(filter);
    
    delay = new Tone.FeedbackDelay({
        delayTime: 0.3,
        feedback: 0.4
    }).connect(distortion);
    delay.wet.value = 0;

    reverb = new Tone.Freeverb({
        roomSize: 0.5,
        dampening: 3000
    }).connect(delay);
    reverb.wet.value = 0.1;

    filter.toDestination();

    waveform = new Tone.Waveform(1024);
    Tone.Destination.connect(waveform);

    // Use PolySynth for multiple voices
    polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'custom',
            partials: [1]
        },
        envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 1
        }
    }).connect(reverb);

    // Sub Oscillator
    subSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'square'
        },
        envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 1
        }
    }).connect(reverb);
    subSynth.volume.value = -6;

    // Noise Generator
    noise = new Tone.Noise('white').start();
    noise.volume.value = -Infinity; // Start silent

    noiseEnv = new Tone.AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 1
    }).connect(reverb);
    
    noise.connect(noiseEnv);

    isStarted = true;
    startButton.classList.add('active');
    startButton.innerText = 'Audio Engine Running';
    
    // Initial wavetable update
    updateWavetable();
}

// UI Event Listeners
startButton.addEventListener('click', initAudio);

// Keyboard UI handling
const keys = document.querySelectorAll('.key');
const keyMap = {};

keys.forEach(key => {
    const k = key.getAttribute('data-key');
    if (k) keyMap[k] = key;

    key.addEventListener('mousedown', () => playNote(key));
    key.addEventListener('mouseup', () => stopNote(key));
    key.addEventListener('mouseleave', () => stopNote(key));
});

let activeNoteCount = 0;

function playNote(keyElement) {
    if (!isStarted || keyElement.classList.contains('active')) return;
    const note = keyElement.getAttribute('data-note');
    
    activeNoteCount++;
    
    // Main Synth
    polySynth.triggerAttack(note);

    // Sub Synth
    const subOctaveOffset = parseInt(document.getElementById('sub-octave').value);
    const subNote = Tone.Frequency(note).transpose(subOctaveOffset * 12).toNote();
    subSynth.triggerAttack(subNote);

    // Noise
    if (activeNoteCount === 1) {
        noiseEnv.triggerAttack();
    }

    keyElement.classList.add('active');
}

function stopNote(keyElement) {
    if (!isStarted || !keyElement.classList.contains('active')) return;
    const note = keyElement.getAttribute('data-note');
    
    activeNoteCount = Math.max(0, activeNoteCount - 1);

    polySynth.triggerRelease(note);

    const subOctaveOffset = parseInt(document.getElementById('sub-octave').value);
    const subNote = Tone.Frequency(note).transpose(subOctaveOffset * 12).toNote();
    subSynth.triggerRelease(subNote);

    // Noise (only release if no more notes are held)
    if (activeNoteCount === 0) {
        noiseEnv.triggerRelease();
    }

    keyElement.classList.remove('active');
}

// Global Keyboard Listeners
const pressedKeys = new Set();
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key] && !pressedKeys.has(key)) {
        pressedKeys.add(key);
        playNote(keyMap[key]);
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        pressedKeys.delete(key);
        stopNote(keyMap[key]);
    }
});

// LFO UI Listeners
document.getElementById('lfo-type').addEventListener('change', (e) => {
    if (lfo) lfo.type = e.target.value;
});

document.getElementById('lfo-rate').addEventListener('input', (e) => {
    if (lfo) lfo.frequency.value = parseFloat(e.target.value);
});

document.getElementById('lfo-depth').addEventListener('input', (e) => {
    if (lfoGain) lfoGain.gain.value = parseFloat(e.target.value);
});

document.getElementById('lfo-target').addEventListener('change', (e) => {
    if (!lfoGain) return;
    
    // Disconnect from previous target(s)
    if (lfoTarget) {
        try {
            if (Array.isArray(lfoTarget)) {
                lfoTarget.forEach(t => lfoGain.disconnect(t));
            } else {
                lfoGain.disconnect(lfoTarget);
            }
        } catch (err) {
            console.log("Modulation cleanup error", err);
        }
        lfoTarget = null;
    }

    const target = e.target.value;
    if (target === 'cutoff' && filter) {
        lfoTarget = filter.frequency;
        lfoGain.connect(lfoTarget);
    } else if (target === 'pitch') {
        // Modulate detune for both synths
        lfoGain.connect(polySynth.detune);
        lfoGain.connect(subSynth.detune);
        lfoTarget = [polySynth.detune, subSynth.detune];
    }
});

// Parameter Updates
document.getElementById('wavetable-select').addEventListener('change', (e) => {
    currentWT = e.target.value;
    updateWavetable();
});

document.getElementById('wt-pos').addEventListener('input', updateWavetable);

document.getElementById('filter-type').addEventListener('change', (e) => {
    if (filter) filter.type = e.target.value;
});

document.getElementById('filter-cutoff').addEventListener('input', (e) => {
    if (filter) filter.frequency.value = parseFloat(e.target.value);
});

// Sub Oscillator UI Listeners
document.getElementById('sub-type').addEventListener('change', (e) => {
    if (subSynth) subSynth.set({ oscillator: { type: e.target.value } });
});

document.getElementById('sub-volume').addEventListener('input', (e) => {
    if (subSynth) {
        // Map 0-1 range to dB (-60 to 0)
        const vol = parseFloat(e.target.value);
        subSynth.volume.value = vol === 0 ? -Infinity : Tone.gainToDb(vol);
    }
});

document.getElementById('env-attack').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (polySynth) polySynth.set({ envelope: { attack: val } });
    if (subSynth) subSynth.set({ envelope: { attack: val } });
    if (noiseEnv) noiseEnv.attack = val;
});

document.getElementById('env-release').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (polySynth) polySynth.set({ envelope: { release: val } });
    if (subSynth) subSynth.set({ envelope: { release: val } });
    if (noiseEnv) noiseEnv.release = val;
});

// Noise UI Listeners
document.getElementById('noise-type').addEventListener('change', (e) => {
    if (noise) noise.type = e.target.value;
});

document.getElementById('noise-volume').addEventListener('input', (e) => {
    if (noise) {
        const vol = parseFloat(e.target.value);
        noise.volume.value = vol === 0 ? -Infinity : Tone.gainToDb(vol);
    }
});

document.getElementById('fx-dist').addEventListener('input', (e) => {
    if (distortion) distortion.distortion = parseFloat(e.target.value);
});

document.getElementById('fx-reverb-mix').addEventListener('input', (e) => {
    if (reverb) reverb.wet.value = parseFloat(e.target.value);
});

document.getElementById('fx-delay-mix').addEventListener('input', (e) => {
    if (delay) delay.wet.value = parseFloat(e.target.value);
});

document.getElementById('fx-delay-time').addEventListener('input', (e) => {
    if (delay) delay.delayTime.value = parseFloat(e.target.value);
});

document.getElementById('fx-delay-feedback').addEventListener('input', (e) => {
    if (delay) delay.feedback.value = parseFloat(e.target.value);
});
