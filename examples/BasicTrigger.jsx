import React, { useState } from 'react';
import { engine } from '../src/audio/Engine';

/**
 * BasicTrigger - A minimal example of how to use the AudioEngine.
 * Demonstrates manual note triggering and parameter updates.
 */
const BasicTrigger = () => {
    const [isStarted, setIsStarted] = useState(false);

    const handleStart = async () => {
        await engine.init();
        setIsStarted(true);
    };

    const playNote = (note) => {
        if (!isStarted) return;
        engine.playNote(note);
    };

    const stopNote = (note) => {
        if (!isStarted) return;
        engine.stopNote(note);
    };

    return (
        <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', borderRadius: '8px' }}>
            <h2>Basic Trigger Example</h2>
            {!isStarted ? (
                <button onClick={handleStart} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Click to Init Audio
                </button>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onMouseDown={() => playNote('C4')} 
                        onMouseUp={() => stopNote('C4')}
                        onMouseLeave={() => stopNote('C4')}
                        style={{ padding: '20px', cursor: 'pointer' }}
                    >
                        Play C4
                    </button>
                    <button 
                        onMouseDown={() => playNote('E4')} 
                        onMouseUp={() => stopNote('E4')}
                        onMouseLeave={() => stopNote('E4')}
                        style={{ padding: '20px', cursor: 'pointer' }}
                    >
                        Play E4
                    </button>
                    <button 
                        onMouseDown={() => playNote('G4')} 
                        onMouseUp={() => stopNote('G4')}
                        onMouseLeave={() => stopNote('G4')}
                        style={{ padding: '20px', cursor: 'pointer' }}
                    >
                        Play G4
                    </button>
                </div>
            )}
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
                Note: This example uses the shared <code>engine</code> instance.
            </p>
        </div>
    );
};

export default BasicTrigger;
