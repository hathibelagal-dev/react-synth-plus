import React, { useState, useEffect, useRef } from 'react';
import { useAudioEngine } from '../src/hooks/useAudioEngine';

/**
 * DroneMachine - Automated parameter modulation with headless hooks.
 * This demonstrates building a specialized component that manages its 
 * own sound logic while leveraging the project hooks.
 */
const DroneMachine = () => {
    const { isStarted, init, setParam, engine } = useAudioEngine();
    const [isActive, setIsActive] = useState(false);
    const [stats, setStats] = useState({ wtPos: 0, cutoff: 2000 });
    const animationFrameRef = useRef(null);

    const handleToggle = async () => {
        if (!isStarted) await init();

        if (!isActive) {
            setParam('env', 'attack', 3);
            setParam('env', 'release', 5);
            setParam('fx', 'reverbMix', 0.6);
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
                const wtPos = (Math.sin(time / 2000) + 1) / 2;
                const cutoff = 500 + (Math.sin(time / 3000) + 1) * 2000;
                
                setParam('osc1', 'wtPos', wtPos);
                setParam('filter', 'cutoff', cutoff);
                
                setStats({ wtPos: wtPos.toFixed(2), cutoff: Math.round(cutoff) });
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animationFrameRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isActive, setParam]);

    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg text-white shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Drone Machine Example</h2>
            
            <button 
                onClick={handleToggle} 
                className={`w-full py-3 rounded font-bold transition-all ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white border-none cursor-pointer`}
            >
                {isActive ? 'STOP DRONE' : 'START DRONE'}
            </button>
            
            {isActive && (
                <div className="mt-6 bg-black p-4 rounded-md border border-slate-700 font-mono text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-slate-400 uppercase tracking-tight">WT Pos</span>
                        <span className="text-emerald-400 font-bold">{stats.wtPos}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full transition-all duration-100" 
                            style={{ width: `${stats.wtPos * 100}%` }}
                        />
                    </div>
                    
                    <div className="flex justify-between pt-2">
                        <span className="text-slate-400 uppercase tracking-tight">Cutoff</span>
                        <span className="text-emerald-400 font-bold">{stats.cutoff}Hz</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full transition-all duration-100" 
                            style={{ width: `${(stats.cutoff / 5000) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <p className="mt-4 text-xs text-slate-500 leading-relaxed italic">
                Automates parameter modulation via <code>requestAnimationFrame</code> for organic, evolving sounds.
            </p>
        </div>
    );
};

export default DroneMachine;
