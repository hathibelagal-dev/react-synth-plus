import { useState, useCallback } from 'react';
import { engine } from '../audio/Engine';

/**
 * Headless hook to manage the AudioEngine state and parameters.
 */
export const useAudioEngine = () => {
    const [isStarted, setIsStarted] = useState(engine.isStarted);

    const init = useCallback(async () => {
        await engine.init();
        setIsStarted(true);
    }, []);

    const setParam = useCallback((module, param, value) => {
        engine.setParam(module, param, value);
    }, []);

    return {
        isStarted,
        init,
        setParam,
        activeNotesCount: engine.activeNotes?.size || 0,
        engine // Direct access to the singleton if needed
    };
};
