import React from 'react';
import { useAudioEngine } from '../src/hooks/useAudioEngine';

/**
 * BasicTrigger - Refactored to use headless hooks and Tailwind CSS.
 * Demonstrates the simplest way to integrate the synth logic into a custom UI.
 */
const BasicTrigger = () => {
    const { isStarted, init, engine } = useAudioEngine();

    const playNote = (note) => {
        if (!isStarted) return;
        engine.playNote(note);
    };

    const stopNote = (note) => {
        if (!isStarted) return;
        engine.stopNote(note);
    };

    return (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-white shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-synth-blue">Basic Trigger Example</h2>
            
            {!isStarted ? (
                <button 
                    onClick={init} 
                    className="btn-alert w-full py-3"
                >
                    INITIALIZE AUDIO
                </button>
            ) : (
                <div className="flex gap-4">
                    {['C4', 'E4', 'G4'].map(note => (
                        <button 
                            key={note}
                            onMouseDown={() => playNote(note)} 
                            onMouseUp={() => stopNote(note)}
                            onMouseLeave={() => stopNote(note)}
                            className="bg-zinc-700 hover:bg-synth-blue hover:text-black transition-all p-8 rounded-md font-mono font-bold flex-1"
                        >
                            {note}
                        </button>
                    ))}
                </div>
            )}
            
            <p className="mt-4 text-xs text-zinc-500 italic">
                Uses the <code>useAudioEngine</code> hook for state management.
            </p>
        </div>
    );
};

export default BasicTrigger;
