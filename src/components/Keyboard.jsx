import React from 'react';
import { useKeyboard } from '../hooks/useKeyboard';

/**
 * Keyboard component refactored to use the headless `useKeyboard` hook and Tailwind CSS.
 */
const Keyboard = ({ subOctave }) => {
    const { pressedNotes, playNote, stopNote, keys } = useKeyboard(subOctave);

    return (
        <section className="mt-2">
            <div className="flex justify-center bg-black p-3 rounded-md shadow-inner">
                {keys.map(({ note, key, type }) => {
                    const isActive = pressedNotes.has(note);
                    const isWhite = type === 'white';
                    
                    return (
                        <div
                            key={note}
                            className={`
                                cursor-pointer border border-black flex items-end justify-center pb-2 box-border font-bold select-none transition-colors
                                ${isWhite 
                                    ? 'w-[50px] h-[160px] bg-gray-100 z-10 text-gray-800 rounded-b-md' 
                                    : 'w-[32px] h-[100px] bg-zinc-800 -ml-4 -mr-4 z-20 text-gray-300 rounded-b-sm'}
                                ${isActive && isWhite ? 'bg-synth-blue' : ''}
                                ${isActive && !isWhite ? 'bg-cyan-700' : ''}
                            `}
                            onMouseDown={() => playNote(note)}
                            onMouseUp={() => stopNote(note)}
                            onMouseLeave={() => stopNote(note)}
                        >
                            <span className="text-[11px]">{key.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Keyboard;
