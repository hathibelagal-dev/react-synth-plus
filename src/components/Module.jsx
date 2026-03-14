import React from 'react';

/**
 * Generic module container with Tailwind styling.
 */
const Module = ({ title, children, className = "" }) => (
    <div className={`synth-module ${className}`}>
        <h3 className="m-0 text-[0.8rem] uppercase text-synth-blue border-b border-zinc-700 pb-1">
            {title}
        </h3>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

export default Module;
