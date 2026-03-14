import React, { useState, useEffect, useRef } from 'react';
import { engine } from '../src/audio/Engine';

/**
 * DroneMachine - An example demonstrating automated parameter modulation.
 * Generates an evolving ambient soundscape by continuously updating 
 * wavetable position and filter cutoff.
 */
const DroneMachine = () => {
    const [isActive, setIsActive] = useState(false);
    const animationFrameRef = useRef(null);
    const [stats, setStats] = useState({ wtPos: 0, cutoff: 2000 });

    const handleToggle = async () => {
        if (!isActive) {
            await engine.init();
            engine.setParam('env', 'attack', 3); // Slow attack for drone
            engine.setParam('env', 'release', 5); // Long release
            engine.setParam('fx', 'reverbMix', 0.6); // Deep space
            engine.playNote('C2');
            engine.playNote('G2');
            engine.playNote('C3');
            setIsActive(true);
        } else {
            engine.stopNote('C2');
            engine.stopNote('G2');
            engine.stopNote('C3');
            setIsActive(false);
        }
    };

    useEffect(() => {
        if (isActive) {
            const animate = (time) => {
                // Modulate WT Position and Cutoff slowly over time
                const wtPos = (Math.sin(time / 2000) + 1) / 2;
                const cutoff = 500 + (Math.sin(time / 3000) + 1) * 2000;
                
                engine.setParam('osc1', 'wtPos', wtPos);
                engine.setParam('filter', 'cutoff', cutoff);
                
                setStats({ wtPos: wtPos.toFixed(2), cutoff: Math.round(cutoff) });
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isActive]);

    return (
        <div style={{ padding: '20px', background: '#2c3e50', color: 'white', borderRadius: '8px' }}>
            <h2>Drone Machine Example</h2>
            <button 
                onClick={handleToggle} 
                style={{ 
                    padding: '12px 24px', 
                    cursor: 'pointer', 
                    background: isActive ? '#e74c3c' : '#27ae60', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}
            >
                {isActive ? 'STOP DRONE' : 'START DRONE'}
            </button>
            
            {isActive && (
                <div style={{ marginTop: '20px', fontFamily: 'monospace' }}>
                    <p>Wavetable Pos: <span style={{ color: '#f1c40f' }}>{stats.wtPos}</span></p>
                    <p>Filter Cutoff: <span style={{ color: '#f1c40f' }}>{stats.cutoff}Hz</span></p>
                </div>
            )}

            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#bdc3c7' }}>
                This example automates parameters from the React <code>useEffect</code> loop
                to create evolving textures.
            </p>
        </div>
    );
};

export default DroneMachine;
