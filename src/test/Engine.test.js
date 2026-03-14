import { describe, it, expect, beforeEach, vi } from 'vitest';
import { engine, wavetables } from '../audio/Engine';
import * as Tone from 'tone';

describe('AudioEngine', () => {
    beforeEach(async () => {
        // Reset engine state if necessary
        engine.isStarted = false;
        await engine.init();
    });

    it('should initialize successfully', async () => {
        expect(engine.isStarted).toBe(true);
        expect(Tone.start).toHaveBeenCalled();
    });

    it('should interpolate partials correctly', () => {
        const table = [
            [1, 0],
            [1, 1]
        ];
        const res0 = engine.interpolatePartials(0, table);
        expect(res0).toEqual([1, 0]);

        const res1 = engine.interpolatePartials(1, table);
        expect(res1).toEqual([1, 1]);

        const resMid = engine.interpolatePartials(0.5, table);
        expect(resMid).toEqual([1, 0.5]);
    });

    it('should update parameter for filter', () => {
        engine.setParam('filter', 'cutoff', 5000);
        expect(engine.filter.frequency.value).toBe(5000);
    });

    it('should play and stop notes', () => {
        engine.playNote('C4');
        expect(engine.activeNotes.has('C4')).toBe(true);
        expect(engine.polySynth.triggerAttack).toHaveBeenCalledWith('C4');

        engine.stopNote('C4');
        expect(engine.activeNotes.has('C4')).toBe(false);
        expect(engine.polySynth.triggerRelease).toHaveBeenCalledWith('C4');
    });

    it('should handle noise envelope trigger on polyphony', () => {
        engine.playNote('C4');
        expect(engine.noiseEnv.triggerAttack).toHaveBeenCalled();

        engine.playNote('E4');
        // triggerAttack should not be called again for the second note
        expect(engine.noiseEnv.triggerAttack).toHaveBeenCalledTimes(1);

        engine.stopNote('C4');
        expect(engine.noiseEnv.triggerRelease).not.toHaveBeenCalled();

        engine.stopNote('E4');
        expect(engine.noiseEnv.triggerRelease).toHaveBeenCalled();
    });
});
