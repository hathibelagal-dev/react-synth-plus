import React from 'react';

const Module = ({ title, children, className = "" }) => (
    <div className={`module ${className}`}>
        <h3>{title}</h3>
        {children}
    </div>
);

export default Module;
