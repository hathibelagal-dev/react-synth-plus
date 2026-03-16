import Module from './Module';

const LFOControl = ({ value, onChange }) => (
    <Module title="LFO 1">
        <label className="synth-label">Shape
            <select className="synth-select" value={value.type} onChange={(e) => onChange('lfo', 'type', e.target.value)}>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
            </select>
        </label>
        <label className="synth-label">Rate (Hz) 
            <input className="synth-range" type="range" min="0.1" max="20" step="0.1" value={value.rate} 
                onChange={(e) => onChange('lfo', 'rate', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Depth 
            <input className="synth-range" type="range" min="0" max="1200" step="1" value={value.depth} 
                onChange={(e) => onChange('lfo', 'depth', parseFloat(e.target.value))} 
            />
        </label>
        <label className="synth-label">Target
            <select className="synth-select" value={value.target} onChange={(e) => onChange('lfo', 'target', e.target.value)}>
                <option value="none">None</option>
                <option value="cutoff">Filter Cutoff</option>
                <option value="pitch">Pitch</option>
            </select>
        </label>
    </Module>
);

export default LFOControl;
