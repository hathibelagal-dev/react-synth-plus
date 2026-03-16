import React from 'react';
import Module from './Module';

const SubControl = ({ value, onChange }) => (
    <Module title="Sub Oscillator">
        <label className="synth-label">Waveform
            <select className="synth-select" value={value.type} onChange={(e) => onChange('sub', 'type', e.target.value)}>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
            </select>
        </label>
        <label className="synth-label">Volume 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.volume} 
                onChange={(e) => onChange('sub', 'volume', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Octave
            <select className="synth-select" value={value.octave} onChange={(e) => onChange('sub', 'octave', parseInt(e.target.value))}>
                <option value={-1}>-1 Oct</option>
                <option value={-2}>-2 Oct</option>
            </select>
        </label>
    </Module>
);

export default SubControl;
