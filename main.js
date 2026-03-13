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
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        if (!isStarted) return;
        const note = key.getAttribute('data-note');
        polySynth.triggerAttack(note);
        key.classList.add('active');
    });

    key.addEventListener('mouseup', () => {
        if (!isStarted) return;
        const note = key.getAttribute('data-note');
        polySynth.triggerRelease(note);
        key.classList.remove('active');
    });

    key.addEventListener('mouseleave', () => {
        if (isStarted) {
            const note = key.getAttribute('data-note');
            polySynth.triggerRelease(note);
            key.classList.remove('active');
        }
    });
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
