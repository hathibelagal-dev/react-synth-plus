// Library entry point

// Core Audio
export { engine as AudioEngine, wavetables } from './audio/Engine';

// Headless Hooks
export { useAudioEngine } from './hooks/useAudioEngine';
export { useKeyboard, KEYS_CONFIG } from './hooks/useKeyboard';

// UI Components
export { default as Visualizer } from './components/Visualizer';
export { default as Keyboard } from './components/Keyboard';
export { default as Module } from './components/Module';
export { default as OscillatorControl } from './components/OscillatorControl';
export { default as SubControl } from './components/SubControl';
export { default as NoiseControl } from './components/NoiseControl';
export { default as FilterControl } from './components/FilterControl';
export { default as LFOControl } from './components/LFOControl';
export { default as EnvelopeControl } from './components/EnvelopeControl';
export { default as FXControl } from './components/FXControl';
