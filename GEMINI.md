# ReactSynth+ Project Context

## Project Overview
ReactSynth+ is a high-performance, web-based wavetable synthesizer inspired by Xfer Serum. It utilizes **Tone.js** for audio synthesis, **HTML5 Canvas** for real-time visualization, and is currently transitioning from a vanilla JavaScript implementation to a **React-based** architecture.

### Core Technologies
- **Audio Engine:** Tone.js (Web Audio API wrapper)
- **UI Framework:** React (Headless Hooks Architecture)
- **Styling:** Tailwind CSS
- **Visualization:** HTML5 Canvas
- **Build Tool:** Vite

## Architecture
The project follows a **Headless Hook** design pattern. The audio logic is encapsulated in the `AudioEngine` singleton, while React hooks provide a reactive interface for components.

### Key Hooks
- `useAudioEngine`: Manages engine initialization and parameter updates.
- `useKeyboard`: Manages note triggering, key state, and QWERTY mapping.

## Development Guidelines
- **Logic vs. UI:** Keep audio logic in `AudioEngine.js` or specialized hooks.
- **Styling:** Use Tailwind CSS utility classes for all UI components.
- **Headless Pattern:** When adding new features (e.g., Modulation Matrix), first create a headless hook before implementing the UI component.

## Building and Running
### Current
- `npm install`
- `npm run dev`
- `npm run build`

## Project Status
The project has successfully transitioned to a React + Tailwind architecture with headless hooks. Core synthesis and visualization are fully functional.

