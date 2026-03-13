let polySynth;
let filter;
let isStarted = false;

const startButton = document.getElementById('start-audio');

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
            type: 'sine'
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
}

// UI Event Listeners
startButton.addEventListener('click', initAudio);

// Keyboard UI handling
const keys = document.querySelectorAll('.key');
const keyMap = {}; // Maps keyboard keys (e.g., 'a') to DOM elements

keys.forEach(key => {
    const k = key.getAttribute('data-key');
    if (k) keyMap[k] = key;

    key.addEventListener('mousedown', () => {
        playNote(key);
    });

    key.addEventListener('mouseup', () => {
        stopNote(key);
    });

    key.addEventListener('mouseleave', () => {
        stopNote(key);
    });
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
document.getElementById('osc-type').addEventListener('change', (e) => {
    if (polySynth) {
        polySynth.set({
            oscillator: { type: e.target.value }
        });
    }
});

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
