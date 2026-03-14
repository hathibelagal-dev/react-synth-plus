import { vi, expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mocking Tone.js
vi.mock('tone', () => {
    return {
        start: vi.fn(),
        gainToDb: vi.fn((val) => 20 * Math.log10(val)),
        Frequency: vi.fn((note) => ({
            transpose: vi.fn((oct) => ({
                toNote: vi.fn(() => note)
            }))
        })),
        Destination: { connect: vi.fn() },
        Filter: vi.fn().mockImplementation(() => ({
            toDestination: vi.fn().mockReturnThis(),
            connect: vi.fn().mockReturnThis(),
            type: 'lowpass',
            frequency: { value: 2000 }
        })),
        Distortion: vi.fn().mockImplementation(() => ({
            connect: vi.fn().mockReturnThis(),
            distortion: 0
        })),
        FeedbackDelay: vi.fn().mockImplementation(() => ({
            connect: vi.fn().mockReturnThis(),
            wet: { value: 0 },
            delayTime: { value: 0.3 },
            feedback: { value: 0.4 }
        })),
        Freeverb: vi.fn().mockImplementation(() => ({
            connect: vi.fn().mockReturnThis(),
            wet: { value: 0.1 }
        })),
        Waveform: vi.fn().mockImplementation(() => ({
            getValue: vi.fn(() => new Float32Array(1024))
        })),
        PolySynth: vi.fn().mockImplementation(() => ({
            connect: vi.fn().mockReturnThis(),
            set: vi.fn(),
            triggerAttack: vi.fn(),
            triggerRelease: vi.fn(),
            volume: { value: -6 },
            detune: { value: 0, connect: vi.fn() }
        })),
        Synth: vi.fn(),
        Noise: vi.fn().mockImplementation(() => ({
            start: vi.fn().mockReturnThis(),
            connect: vi.fn().mockReturnThis(),
            volume: { value: -Infinity },
            type: 'white'
        })),
        AmplitudeEnvelope: vi.fn().mockImplementation(() => ({
            connect: vi.fn().mockReturnThis(),
            triggerAttack: vi.fn(),
            triggerRelease: vi.fn(),
            attack: 0.1,
            release: 1
        })),
        LFO: vi.fn().mockImplementation(() => ({
            start: vi.fn().mockReturnThis(),
            connect: vi.fn().mockReturnThis(),
            frequency: { value: 1 },
            type: 'sine'
        })),
        Gain: vi.fn().mockImplementation(() => ({
            connect: vi.fn(),
            disconnect: vi.fn(),
            gain: { value: 0 }
        }))
    };
});

// Mocking ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
