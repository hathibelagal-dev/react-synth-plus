import React, { useState, useEffect } from 'react';
import { engine, wavetables } from './audio/Engine';
import Visualizer from './components/Visualizer';
import Keyboard from './components/Keyboard';
import Module from './components/Module';
import './App.css';

const App = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [osc1, setOsc1] = useState({ wavetable: 'basic', wtPos: 0 });
    const [sub, setSub] = useState({ type: 'square', volume: 0.5, octave: -2 });
    const [noise, setNoise] = useState({ type: 'white', volume: 0 });
    const [filter, setFilter] = useState({ type: 'lowpass', cutoff: 2000 });
    const [lfo, setLfo] = useState({ type: 'sine', rate: 1, depth: 0, target: 'none' });
    const [env, setEnv] = useState({ attack: 0.1, release: 1 });
    const [fx, setFx] = useState({ dist: 0, reverbMix: 0.1, delayMix: 0, delayTime: 0.3, delayFeedback: 0.4 });
    const [fps, setFps] = useState(0);

    const handleStart = async () => {
        await engine.init();
        setIsStarted(true);
    };

    const updateParam = (module, param, value) => {
        engine.setParam(module, param, value);
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
                frameCount = 0;
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div id="app">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>ReactSynth+</h1>
                <div id="perf-monitor" style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                    FPS: <span>{fps}</span> | Voices: <span>{isStarted ? engine.activeNotes.size : 0}</span>
                </div>
            </header>

            <Visualizer />

            <section className="controls">
                <button 
                    id="start-audio" 
                    className={isStarted ? 'active' : ''} 
                    onClick={handleStart}
                >
                    {isStarted ? 'Audio Engine Running' : 'INITIALIZE AUDIO ENGINE'}
                </button>

                <Module title="Oscillator 1">
                    <label>Wavetable
                        <select value={osc1.wavetable} onChange={(e) => updateParam('osc1', 'wavetable', e.target.value)}>
                            {Object.keys(wavetables).map(wt => <option key={wt} value={wt}>{wt}</option>)}
                        </select>
                    </label>
                    <label>WT POS <input type="range" min="0" max="1" step="0.01" value={osc1.wtPos} onChange={(e) => updateParam('osc1', 'wtPos', parseFloat(e.target.value))} /></label>
                </Module>

                <Module title="Sub Oscillator">
                    <label>Waveform
                        <select value={sub.type} onChange={(e) => updateParam('sub', 'type', e.target.value)}>
                            <option value="sine">Sine</option>
                            <option value="square">Square</option>
                            <option value="sawtooth">Sawtooth</option>
                            <option value="triangle">Triangle</option>
                        </select>
                    </label>
                    <label>Volume <input type="range" min="0" max="1" step="0.01" value={sub.volume} onChange={(e) => updateParam('sub', 'volume', parseFloat(e.target.value))} /></label>
                    <label>Octave
                        <select value={sub.octave} onChange={(e) => updateParam('sub', 'octave', parseInt(e.target.value))}>
                            <option value={-1}>-1 Oct</option>
                            <option value={-2}>-2 Oct</option>
                        </select>
                    </label>
                </Module>

                <Module title="Noise Gen">
                    <label>Type
                        <select value={noise.type} onChange={(e) => updateParam('noise', 'type', e.target.value)}>
                            <option value="white">White</option>
                            <option value="pink">Pink</option>
                            <option value="brown">Brown</option>
                        </select>
                    </label>
                    <label>Volume <input type="range" min="0" max="1" step="0.01" value={noise.volume} onChange={(e) => updateParam('noise', 'volume', parseFloat(e.target.value))} /></label>
                </Module>

                <Module title="Filter">
                    <label>Mode
                        <select value={filter.type} onChange={(e) => updateParam('filter', 'type', e.target.value)}>
                            <option value="lowpass">Lowpass</option>
                            <option value="highpass">Highpass</option>
                            <option value="bandpass">Bandpass</option>
                        </select>
                    </label>
                    <label>Cutoff <input type="range" min="20" max="10000" value={filter.cutoff} onChange={(e) => updateParam('filter', 'cutoff', parseFloat(e.target.value))} /></label>
                </Module>

                <Module title="LFO 1">
                    <label>Shape
                        <select value={lfo.type} onChange={(e) => updateParam('lfo', 'type', e.target.value)}>
                            <option value="sine">Sine</option>
                            <option value="square">Square</option>
                            <option value="sawtooth">Sawtooth</option>
                            <option value="triangle">Triangle</option>
                        </select>
                    </label>
                    <label>Rate (Hz) <input type="range" min="0.1" max="20" step="0.1" value={lfo.rate} onChange={(e) => updateParam('lfo', 'rate', parseFloat(e.target.value))} /></label>
                    <label>Depth <input type="range" min="0" max="1200" step="1" value={lfo.depth} onChange={(e) => updateParam('lfo', 'depth', parseFloat(e.target.value))} /></label>
                    <label>Target
                        <select value={lfo.target} onChange={(e) => updateParam('lfo', 'target', e.target.value)}>
                            <option value="none">None</option>
                            <option value="cutoff">Filter Cutoff</option>
                            <option value="pitch">Pitch</option>
                        </select>
                    </label>
                </Module>

                <Module title="Master Envelope">
                    <label>Attack <input type="range" min="0" max="2" step="0.01" value={env.attack} onChange={(e) => updateParam('env', 'attack', parseFloat(e.target.value))} /></label>
                    <label>Release <input type="range" min="0" max="5" step="0.01" value={env.release} onChange={(e) => updateParam('env', 'release', parseFloat(e.target.value))} /></label>
                </Module>

                <Module title="FX Rack" className="fx">
                    <label>Distortion <input type="range" min="0" max="1" step="0.01" value={fx.dist} onChange={(e) => updateParam('fx', 'dist', parseFloat(e.target.value))} /></label>
                    <label>Reverb Mix <input type="range" min="0" max="1" step="0.01" value={fx.reverbMix} onChange={(e) => updateParam('fx', 'reverbMix', parseFloat(e.target.value))} /></label>
                    <div className="fx-divider"></div>
                    <label>Delay Mix <input type="range" min="0" max="1" step="0.01" value={fx.delayMix} onChange={(e) => updateParam('fx', 'delayMix', parseFloat(e.target.value))} /></label>
                    <label>Delay Time <input type="range" min="0" max="1" step="0.01" value={fx.delayTime} onChange={(e) => updateParam('fx', 'delayTime', parseFloat(e.target.value))} /></label>
                    <label>Delay FB <input type="range" min="0" max="1" step="0.01" value={fx.delayFeedback} onChange={(e) => updateParam('fx', 'delayFeedback', parseFloat(e.target.value))} /></label>
                </Module>
            </section>

            <Keyboard subOctave={sub.octave} />
        </div>
    );
};

export default App;
