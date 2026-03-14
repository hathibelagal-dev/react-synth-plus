# ReactSynth+ Project Context

## Project Overview
ReactSynth+ is a high-performance, web-based wavetable synthesizer inspired by Xfer Serum. It utilizes **Tone.js** for audio synthesis, **HTML5 Canvas** for real-time visualization, and is currently transitioning from a vanilla JavaScript implementation to a **React-based** architecture.

### Core Technologies
- **Audio Engine:** Tone.js (Web Audio API wrapper)
- **UI Framework:** React (Current Target) / Vanilla JS (Legacy)
- **Visualization:** HTML5 Canvas
- **Styling:** Vanilla CSS
- **Build Tool:** Vite (Proposed)

## Architecture
The project follows a modular design where different synthesis components (Oscillators, Filters, LFOs, Envelopes, FX) are treated as independent modules.

### Audio Signal Path
```text
[Osc 1] --\
[Osc 2] ----> [Mixer] ---> [Filter] ---> [FX Chain] ---> [Limiter] ---> [Output]
[Sub]   --/
[Noise] -/
```

### Key Modules
- **Oscillator 1:** Dual wavetable oscillator with morphing/interpolation.
- **Sub Oscillator:** Dedicated low-frequency oscillator for reinforcement.
- **Noise Generator:** Supports White, Pink, and Brownian noise.
- **Filter:** Multi-mode (Lowpass, Highpass, Bandpass) with LFO modulation.
- **LFO:** Customizable shapes and routing (Targeting Cutoff/Pitch).
- **FX Rack:** Includes Distortion, Reverb, and Delay.

## Development Guidelines
- **Audio Lifecycle:** Always ensure `Tone.start()` is called via user interaction before starting the audio engine.
- **Performance:** Maintain a high frame rate for the canvas visualizer and minimize audio thread lag by optimizing polyphonic voice allocation.
- **State Management:** Use React state/context for UI parameters and sync them with the underlying Tone.js nodes.

## Building and Running
### Current (Legacy)
- Open `index.html` directly in a browser or use a simple live server.

### Future (React/Vite)
- `npm install`
- `npm run dev`
- `npm run build`

## Project Status
The project is currently in **Phase 2/3** of its roadmap, with core synthesis and visualization working in vanilla JS. The next major step is refactoring the UI and state management into React.
