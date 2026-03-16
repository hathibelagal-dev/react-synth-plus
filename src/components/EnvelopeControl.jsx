import React from 'react';
import Module from './Module';

const EnvelopeControl = ({ value, onChange }) => (
    <Module title="Master Envelope">
        <label className="synth-label">Attack 
            <input className="synth-range" type="range" min="0" max="2" step="0.01" value={value.attack} 
                onChange={(e) => onChange('env', 'attack', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Release 
            <input className="synth-range" type="range" min="0" max="5" step="0.01" value={value.release} 
                onChange={(e) => onChange('env', 'release', parseFloat(e.target.value))} 
            />
        </label>
    </Module>
);

export default EnvelopeControl;
