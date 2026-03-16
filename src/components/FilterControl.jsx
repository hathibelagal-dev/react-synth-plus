import React from 'react';
import Module from './Module';

const FilterControl = ({ value, onChange }) => (
    <Module title="Filter">
        <label className="synth-label">Mode
            <select className="synth-select" value={value.type} onChange={(e) => onChange('filter', 'type', e.target.value)}>
                <option value="lowpass">Lowpass</option>
                <option value="highpass">Highpass</option>
                <option value="bandpass">Bandpass</option>
            </select>
        </label>
        <label className="synth-label">Cutoff 
            <input className="synth-range" type="range" min="20" max="10000" value={value.cutoff} 
                onChange={(e) => onChange('filter', 'cutoff', parseFloat(e.target.value))} 
            />
        </label>
    </Module>
);

export default FilterControl;
