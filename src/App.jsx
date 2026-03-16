import React, { useState, useEffect } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import Visualizer from './components/Visualizer';
import Keyboard from './components/Keyboard';
import OscillatorControl from './components/OscillatorControl';
import SubControl from './components/SubControl';
import NoiseControl from './components/NoiseControl';
import FilterControl from './components/FilterControl';
import LFOControl from './components/LFOControl';
import EnvelopeControl from './components/EnvelopeControl';
import FXControl from './components/FXControl';

const App = () => {
    const { isStarted, init, setParam, engine } = useAudioEngine();
    
    // UI state for syncing with AudioEngine params
    const [osc1, setOsc1] = useState({ wavetable: 'basic', wtPos: 0 });
    const [sub, setSub] = useState({ type: 'square', volume: 0.5, octave: -2 });
    const [noise, setNoise] = useState({ type: 'white', volume: 0 });
    const [filter, setFilter] = useState({ type: 'lowpass', cutoff: 2000 });
    const [lfo, setLfo] = useState({ type: 'sine', rate: 1, depth: 0, target: 'none' });
    const [env, setEnv] = useState({ attack: 0.1, release: 1 });
    const [fx, setFx] = useState({ dist: 0, reverbMix: 0.1, delayMix: 0, delayTime: 0.3, delayFeedback: 0.4 });
    const [fps, setFps] = useState(0);
    const [activeVoices, setActiveVoices] = useState(0);

    const updateParam = (module, param, value) => {
        setParam(module, param, value);
        switch (module) {
            case 'osc1': setOsc1(prev => ({ ...prev, [param]: value })); break;
            case 'sub': setSub(prev => ({ ...prev, [param]: value })); break;
            case 'noise': setNoise(prev => ({ ...prev, [param]: value })); break;
            case 'filter': setFilter(prev => ({ ...prev, [param]: value })); break;
            case 'lfo': setLfo(prev => ({ ...prev, [param]: value })); break;
            case 'env': setEnv(prev => ({ ...prev, [param]: value })); break;
            case 'fx': setFx(prev => ({ ...prev, [param]: value })); break;
        }
    };

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;

        const loop = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                setActiveVoices(engine?.activeNotes?.size || 0);
                frameCount = 0;
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [engine]);

    return (
        <div id="app" className="bg-synth-panel p-6 rounded-xl shadow-2xl w-[1250px] flex flex-col gap-5 border border-zinc-800">
            <header className="flex justify-between items-center">
                <h1 className="text-sm m-0 text-gray-500 uppercase tracking-widest font-bold">ReactSynth+</h1>
                <div id="perf-monitor" className="text-[0.75rem] text-gray-600 font-mono">
                    FPS: <span>{fps}</span> | Voices: <span>{activeVoices}</span>
                </div>
            </header>

            <Visualizer />

            <section className="grid grid-cols-[repeat(7,1fr)_1.2fr] gap-4">
                <button 
                    id="start-audio" 
                    className={`col-span-full py-2 rounded font-bold transition-all border-none ${isStarted ? 'btn-active' : 'btn-alert'}`}
                    onClick={init}
                >
                    {isStarted ? 'AUDIO ENGINE RUNNING' : 'INITIALIZE AUDIO ENGINE'}
                </button>

                <OscillatorControl value={osc1} onChange={updateParam} />
                <SubControl value={sub} onChange={updateParam} />
                <NoiseControl value={noise} onChange={updateParam} />
                <FilterControl value={filter} onChange={updateParam} />
                <LFOControl value={lfo} onChange={updateParam} />
                <EnvelopeControl value={env} onChange={updateParam} />
                <FXControl value={fx} onChange={updateParam} />
            </section>

            <Keyboard subOctave={sub.octave} />
        </div>
    );
};

export default App;
