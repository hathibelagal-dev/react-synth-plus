import { useState, useCallback, useEffect } from 'react';
import { engine } from '../audio/Engine';

export const KEYS_CONFIG = [
    { note: 'C4', key: 'a', type: 'white' },
    { note: 'C#4', key: 'w', type: 'black' },
    { note: 'D4', key: 's', type: 'white' },
    { note: 'D#4', key: 'e', type: 'black' },
    { note: 'E4', key: 'd', type: 'white' },
    { note: 'F4', key: 'f', type: 'white' },
    { note: 'F#4', key: 't', type: 'black' },
    { note: 'G4', key: 'g', type: 'white' },
    { note: 'G#4', key: 'y', type: 'black' },
    { note: 'A4', key: 'h', type: 'white' },
    { note: 'A#4', key: 'u', type: 'black' },
    { note: 'B4', key: 'j', type: 'white' },
    { note: 'C5', key: 'k', type: 'white' },
];

/**
 * Headless hook to manage keyboard interactions and note triggering.
 * @param {number} subOctave - The octave offset for the sub oscillator.
 */
export const useKeyboard = (subOctave = -2) => {
    const [pressedNotes, setPressedNotes] = useState(new Set());

    const playNote = useCallback((note) => {
        if (!engine.isStarted) return;
        engine.playNote(note, subOctave);
        setPressedNotes(prev => new Set(prev).add(note));
    }, [subOctave]);

    const stopNote = useCallback((note) => {
        if (!engine.isStarted) return;
        engine.stopNote(note, subOctave);
        setPressedNotes(prev => {
            const next = new Set(prev);
            next.delete(note);
            return next;
        });
    }, [subOctave]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return;
            const key = e.key.toLowerCase();
            const config = KEYS_CONFIG.find(k => k.key === key);
            if (config && !pressedNotes.has(config.note)) {
                playNote(config.note);
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            const config = KEYS_CONFIG.find(k => k.key === key);
            if (config) {
                stopNote(config.note);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [pressedNotes, playNote, stopNote]);

    return {
        pressedNotes,
        playNote,
        stopNote,
        keys: KEYS_CONFIG
    };
};
