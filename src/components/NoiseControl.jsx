import Module from './Module';

const NoiseControl = ({ value, onChange }) => (
    <Module title="Noise Gen">
        <label className="synth-label">Type
            <select className="synth-select" value={value.type} onChange={(e) => onChange('noise', 'type', e.target.value)}>
                <option value="white">White</option>
                <option value="pink">Pink</option>
                <option value="brown">Brown</option>
            </select>
        </label>
        <label className="synth-label">Volume 
            <input className="synth-range" type="range" min="0" max="1" step="0.01" value={value.volume} 
                onChange={(e) => onChange('noise', 'volume', parseFloat(e.target.value))} 
            />
        </label>
    </Module>
);

export default NoiseControl;
