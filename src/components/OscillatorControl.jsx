import React from 'react';
import { wavetables } from '../audio/Engine';
import Module from './Module';

const OscillatorControl = ({ value, onChange }) => (
    <Module title="Oscillator 1">
        <label className="synth-label">Wavetable
            <select className="synth-select" value={value.wavetable} onChange={(e) => onChange('osc1', 'wavetable', e.target.value)}>
                {Object.keys(wavetables).map(wt => <option key={wt} value={wt}>{wt}</option>)}
            </select>
        </label>
        <label className="synth-label">WT POS 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.wtPos} 
                onChange={(e) => onChange('osc1', 'wtPos', parseFloat(e.target.value))} 
            />
        </label>
    </Module>
);

export default OscillatorControl;
