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
let filter;
let isStarted = false;
const startButton = document.getElementById('start-audio');

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
    }).toDestination();

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
    }).connect(filter);

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

function playNote(keyElement) {
    if (!isStarted || keyElement.classList.contains('active')) return;
    const note = keyElement.getAttribute('data-note');
    polySynth.triggerAttack(note);
    keyElement.classList.add('active');
}

function stopNote(keyElement) {
    if (!isStarted || !keyElement.classList.contains('active')) return;
    const note = keyElement.getAttribute('data-note');
    polySynth.triggerRelease(note);
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

// Parameter Updates
document.getElementById('wavetable-select').addEventListener('change', (e) => {
    currentWT = e.target.value;
    updateWavetable();
});

document.getElementById('wt-pos').addEventListener('input', updateWavetable);

document.getElementById('filter-cutoff').addEventListener('input', (e) => {
    if (filter) filter.frequency.value = parseFloat(e.target.value);
});

document.getElementById('env-attack').addEventListener('input', (e) => {
    if (polySynth) {
        polySynth.set({
            envelope: { attack: parseFloat(e.target.value) }
        });
    }
});

document.getElementById('env-release').addEventListener('input', (e) => {
    if (polySynth) {
        polySynth.set({
            envelope: { release: parseFloat(e.target.value) }
        });
    }
});
