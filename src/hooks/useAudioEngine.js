import { useState, useCallback, useEffect } from 'react';
import { engine } from '../audio/Engine';

/**
 * Headless hook to manage the AudioEngine state and parameters.
 */
export const useAudioEngine = () => {
    const [isStarted, setIsStarted] = useState(engine.isStarted);
    const [activeNotesCount, setActiveNotesCount] = useState(engine.activeNotes?.size || 0);

    useEffect(() => {
        const unsubscribe = engine.subscribe(() => {
            setIsStarted(engine.isStarted);
            setActiveNotesCount(engine.activeNotes.size);
        });
        return unsubscribe;
    }, []);

    const init = useCallback(async () => {
        await engine.init();
    }, []);

    const setParam = useCallback((module, param, value) => {
        engine.setParam(module, param, value);
    }, []);

    return {
        isStarted,
        init,
        setParam,
        activeNotesCount,
        engine // Direct access to the singleton if needed
    };
};
