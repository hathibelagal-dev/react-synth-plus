import React, { useState } from 'react';
import { useAudioEngine } from '../src/hooks/useAudioEngine';

/**
 * BasicTrigger - Refactored to use headless hooks and Tailwind CSS.
 * Demonstrates the simplest way to integrate the synth logic and 
 * parameter controls (like filters) into a custom UI.
 */
const BasicTrigger = () => {
    const { isStarted, init, setParam, engine } = useAudioEngine();
    const [cutoff, setCutoff] = useState(2000);

    const playNote = (note) => {
        if (!isStarted) return;
        engine.playNote(note);
    };

    const stopNote = (note) => {
        if (!isStarted) return;
        engine.stopNote(note);
    };

    const handleCutoffChange = (e) => {
        const value = parseFloat(e.target.value);
        setCutoff(value);
        setParam('filter', 'cutoff', value);
    };

    return (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-white shadow-xl flex flex-col gap-6">
            <h2 className="text-xl font-bold text-synth-blue">Basic Trigger & Filter</h2>
            
            {!isStarted ? (
                <button 
                    onClick={init} 
                    className="btn-alert w-full py-3"
                >
                    INITIALIZE AUDIO
                </button>
            ) : (
                <>
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

                    <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                        <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">
                            Filter Cutoff: <span className="text-synth-blue">{cutoff}Hz</span>
                        </label>
                        <input 
                            type="range" 
                            min="20" 
                            max="10000" 
                            value={cutoff} 
                            onChange={handleCutoffChange}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-synth-blue"
                        />
                    </div>
                </>
            )}
            
            <p className="text-xs text-zinc-500 italic">
                Demonstrates <code>engine.playNote</code> and <code>setParam('filter', 'cutoff', value)</code>.
            </p>
        </div>
    );
};

export default BasicTrigger;
