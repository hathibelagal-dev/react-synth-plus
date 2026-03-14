import React from 'react';
import BasicTrigger from './BasicTrigger';
import DroneMachine from './DroneMachine';
import App from '../src/App';

/**
 * Showcase - A "project in a box" to test all project functionality.
 * This demonstrates how multiple components (main synth and standalone examples)
 * can coexist and share the underlying AudioEngine state.
 */
const Showcase = () => {
    return (
        <div className="min-h-screen bg-zinc-950 p-10 flex flex-col gap-10">
            <header className="">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">
                    ReactSynth+ <span className="text-synth-blue">Showcase</span>
                </h1>
                <p className="text-zinc-500 max-w-lg">
                    A demonstration of the headless hook architecture and Tailwind CSS utility classes.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
                {/* Standalone Examples Section */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <section>
                        <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Example: Standalone Note Trigger</h3>
                        <BasicTrigger />
                    </section>
                    
                    <section>
                        <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Example: Evolving Drone Soundscape</h3>
                        <DroneMachine />
                    </section>
                </div>

                {/* Main Application Section */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Main Component: Full Synthesizer Interface</h3>
                    <div className="flex justify-center lg:justify-start">
                        <App />
                    </div>
                </div>
            </div>

            <footer className="mt-10 pt-10 border-t border-zinc-800 w-full text-center text-zinc-600 text-sm">
                Built with React, Tone.js, and Tailwind CSS.
            </footer>
        </div>
    );
};

export default Showcase;
