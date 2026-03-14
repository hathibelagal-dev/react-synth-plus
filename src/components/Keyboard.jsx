import React, { useEffect, useState, useCallback } from 'react';
import { engine } from '../audio/Engine';

const KEYS = [
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

const Keyboard = ({ subOctave }) => {
    const [pressedNotes, setPressedNotes] = useState(new Set());

    const handlePlayNote = useCallback((note) => {
        if (!engine.isStarted) return;
        engine.playNote(note, subOctave);
        setPressedNotes(prev => new Set(prev).add(note));
    }, [subOctave]);

    const handleStopNote = useCallback((note) => {
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
            const key = e.key.toLowerCase();
            const config = KEYS.find(k => k.key === key);
            if (config && !pressedNotes.has(config.note)) {
                handlePlayNote(config.note);
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            const config = KEYS.find(k => k.key === key);
            if (config) {
                handleStopNote(config.note);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [pressedNotes, handlePlayNote, handleStopNote]);

    return (
        <section className="play-zone">
            <div className="keyboard">
                {KEYS.map(({ note, key, type }) => (
                    <div
                        key={note}
                        className={`key ${type} ${pressedNotes.has(note) ? 'active' : ''}`}
                        onMouseDown={() => handlePlayNote(note)}
                        onMouseUp={() => handleStopNote(note)}
                        onMouseLeave={() => handleStopNote(note)}
                    >
                        <span>{key.toUpperCase()}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Keyboard;
