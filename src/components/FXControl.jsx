import React from 'react';
import Module from './Module';

const FXControl = ({ value, onChange }) => (
    <Module title="FX Rack">
        <label className="synth-label">Distortion 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.dist} 
                onChange={(e) => onChange('fx', 'dist', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Reverb Mix 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.reverbMix} 
                onChange={(e) => onChange('fx', 'reverbMix', parseFloat(e.target.value))} 
            />
        </label>
        <div className="h-[1px] bg-zinc-700 my-1"></div>
        <label className="synth-label">Delay Mix 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.delayMix} 
                onChange={(e) => onChange('fx', 'delayMix', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Delay Time 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.delayTime} 
                onChange={(e) => onChange('fx', 'delayTime', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Delay FB 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.delayFeedback} 
                onChange={(e) => onChange('fx', 'delayFeedback', parseFloat(e.target.value))} 
            />
        </label>
    </Module>
);

export default FXControl;
