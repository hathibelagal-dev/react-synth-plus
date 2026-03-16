# 🎹 React Synth Plus

[![NPM Version](https://img.shields.io/npm/v/react-synth-plus?color=00d2ff&style=flat-square)](https://www.npmjs.com/package/react-synth-plus)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0)

**React Synth Plus** is a high-performance, headless wavetable synthesizer for React, built on top of the powerful [Tone.js](https://tonejs.github.io/) engine. Inspired by legendary synthesizers like Xfer Serum, it brings professional-grade audio synthesis to the browser with a modern, reactive developer experience.

---

## ✨ Key Features

- 🚀 **Headless Architecture**: Complete separation of audio logic and UI. Build your own synth interface using our custom React hooks.
- 🎨 **Pre-built UI Components**: Optional, modular components (Keyboard, Filters, FX) for instant dashboard creation.
- 🌊 **Wavetable Engine**: Smooth morphing between complex wavetable partials.
- 🎸 **Built-in FX Rack**: Professional distortion, reverb, and feedback delay out of the box.
- 🎹 **Intelligent Keyboard Hook**: Effortless QWERTY-to-MIDI mapping and polyphonic note management.
- 🧪 **Rock Solid**: Fully tested with Vitest and React Testing Library.

---

## 📦 Installation

```bash
npm install react-synth-plus
```

*Note: Ensure you have `react`, `react-dom`, and `tone` installed in your project.*

### 1. Using Pre-built UI Components
The fastest way to get started. Import the components and the bundled CSS for a professional look.

```jsx
import { useState } from 'react';
import { Keyboard, FilterControl, useAudioEngine } from 'react-synth-plus';
import 'react-synth-plus/style.css'; // Don't forget the styles!

const MySynth = () => {
  const { isStarted, init, setParam } = useAudioEngine();
  const [filterState, setFilterState] = useState({ type: 'lowpass', cutoff: 2000 });

  return (
    <div className="p-10 bg-zinc-950 min-h-screen text-white">
      {!isStarted ? (
        <button className="bg-red-500 p-4 rounded" onClick={init}>Start Engine</button>
      ) : (
        <div className="flex flex-col gap-4">
          <FilterControl value={filterState} onChange={setParam} />
          <Keyboard />
        </div>
      )}
    </div>
  );
};
```

---

## 🏗️ UI Component Library

React Synth Plus ships with a set of modular, Tailwind-styled components. To use them, ensure you import `react-synth-plus/style.css`.

| Component | Description |
| :--- | :--- |
| **`<Keyboard />`** | A full piano roll with mouse, touch, and QWERTY support. |
| **`<Visualizer />`** | Real-time HTML5 Canvas oscilloscope. |
| **`<OscillatorControl />`** | Controls for wavetable selection and morphing. |
| **`<FilterControl />`** | Controls for filter mode and cutoff frequency. |
| **`<SubControl />`** | Controls for the sub-oscillator. |
| **` <NoiseControl />`** | Controls for the noise generator. |
| **`<LFOControl />`** | Controls for LFO rate, depth, and routing. |
| **`<EnvelopeControl />`** | Controls for the master ADSR envelope. |
| **`<FXControl />`** | Controls for distortion, reverb, and delay. |

---

## 🚀 Headless Hooks (Advanced)
Build your own UI logic from scratch using the `useAudioEngine` hook.

```jsx
import { useAudioEngine } from 'react-synth-plus';

const MySynth = () => {
  const { isStarted, init, engine } = useAudioEngine();

  return (
    <div>
      {!isStarted ? (
        <button onClick={init}>Initialize Audio</button>
      ) : (
        <button onMouseDown={() => engine.playNote('C4')} onMouseUp={() => engine.stopNote('C4')}>
          Play C4
        </button>
      )}
    </div>
  );
};
```

### 2. Controlling Parameters
Manipulate any part of the audio engine (Filters, Envelopes, FX) using the `setParam(module, parameter, value)` function.

```jsx
import { useAudioEngine } from 'react-synth-plus';

const FilterControl = () => {
  const { setParam } = useAudioEngine();

  return (
    <input 
      type="range" min="20" max="10000" 
      onChange={(e) => setParam('filter', 'cutoff', parseFloat(e.target.value))} 
    />
  );
};
```

#### Available Parameters:

| Module | Parameter | Description |
| :--- | :--- | :--- |
| **`osc1`** | `wavetable`, `wtPos` | Select table (`basic`, `harmonic`) and morph position (0-1). |
| **`filter`** | `type`, `cutoff` | Mode (`lowpass`, `highpass`, `bandpass`) and frequency (Hz). |
| **`sub`** | `type`, `volume` | Waveform and gain (0-1) for the sub oscillator. |
| **`noise`** | `type`, `volume` | Type (`white`, `pink`, `brown`) and gain (0-1). |
| **`lfo`** | `type`, `rate`, `depth`, `target` | LFO shape, speed (Hz), depth, and target (`cutoff`, `pitch`). |
| **`env`** | `attack`, `release` | ADSR timings (seconds) for the master amplitude envelope. |
| **`fx`** | `dist`, `reverbMix`, `delayMix`, `delayTime`, `delayFeedback` | Global distortion, reverb mix, and delay rack parameters. |

### 3. Building a Keyboard
Leverage `useKeyboard` for instant on-screen and QWERTY keyboard support.

```jsx
import { useKeyboard } from 'react-synth-plus';

const MyKeyboard = () => {
  const { pressedNotes, playNote, stopNote, keys } = useKeyboard();

  return (
    <div className="flex gap-1">
      {keys.map(({ note, key, type }) => (
        <div
          key={note}
          className={`p-4 border ${pressedNotes.has(note) ? 'bg-blue-500' : 'bg-white'}`}
          onMouseDown={() => playNote(note)}
          onMouseUp={() => stopNote(note)}
        >
          {key.toUpperCase()}
        </div>
      ))}
    </div>
  );
};
```

---

## 🛠️ Development & Examples

This repository includes a comprehensive **Showcase Project** that demonstrates all features in a single dashboard.

### Run the Showcase
```bash
git clone https://github.com/hathibelagal-dev/react-synth-plus.git
cd react-synth-plus
npm install
npm run dev:showcase
```

### Building the Library
```bash
npm run build:lib
```

### Running Tests
```bash
npm test
```

---

## 📐 Architecture

```text
[Your UI Components] <---> [Headless Hooks] <---> [Audio Engine (Tone.js)]
      (Tailwind)          (useAudioEngine)         (PolySynth, FX)
```

---

## 📜 License

Distributed under the **GPL v3 License**. See `LICENSE` for more information.

---

*Made with ❤️ and a lot of oscillators.*
