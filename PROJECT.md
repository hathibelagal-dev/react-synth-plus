# Project Plan: WaveSerumJS

A high-performance, web-based wavetable synthesizer inspired by Xfer Serum, built using Tone.js, HTML5 Canvas, and modern JavaScript.

## 1. Overview
The goal is to create a fully functional, polyphonic wavetable synthesizer that runs in the browser. It will feature dual wavetable oscillators, a sub-oscillator, a noise generator, multi-mode filters, and a flexible modulation system (LFOs/Envelopes).

## 2. Core Architecture
- **Audio Engine**: Tone.js (Web Audio API wrapper).
- **Polyphony**: `Tone.PolySynth` managing multiple voice instances.
- **Synthesis Type**: Wavetable synthesis using `PeriodicWave` and custom partials.
- **UI Framework**: Vanilla JS or React (for state management of parameters).
- **Visualization**: HTML5 Canvas / WebGL for real-time waveform and spectrum display.

## 3. Feature Set

### Phase 1: Audio Foundation
- [x] **Dual Wavetable Oscillators**: Basic oscillator implementation with custom partials (v0.4)
- [x] **Sub-Oscillator**: Dedicated sub-osc with octave and waveform control (v0.9)
- [x] **Noise Generator**: White/Pink/Brownian noise with filtering (v0.10)
- [x] **Polyphonic Management**: PolySynth implementation with keyboard UI (v0.2)

### Phase 2: Wavetable Engine
- [x] **Wavetable Morphing**: Interpolation between partial sets via WT POS slider (v0.4)
- [ ] **Warp Modes**: Implementation of basic "warp" effects like FM and Sync.
- [x] **Visualizer**: Real-time oscilloscope for waveform display (v0.5)

### Phase 3: Modulation & Routing
- [x] **Envelopes (ADSR)**: Dedicated envelopes for Amplitude (v0.1)
- [ ] **LFOs**: Customizable shapes with rate/sync options.
- [ ] **Modulation Matrix**: A system to map sources (LFO, Env, Velocity) to destinations (Cutoff, Wavetable Pos, Pitch).

### Phase 4: Filters & Effects
- [x] **Multi-mode Filter**: Lowpass, Highpass, Bandpass (v0.6)
- [x] **FX Rack**: 
    - [x] Reverb (Freeverb) (v0.7)
    - [x] Delay (FeedbackDelay) (v0.8)
    - [x] Distortion (Waveshaper) (v0.7)
    - [ ] Chorus/Flanger

### Phase 5: UI/UX & Interactivity
- [x] **Modular Rack Layout**: Horizontal grid design for better visibility (v0.6)
- [x] **Performance Monitor**: Real-time FPS and active voice tracking (v0.10)
- [x] **Interactive Knobs/Sliders**: Basic range sliders implemented.
- [x] **Keyboard Support**: On-screen piano roll and QWERTY mapping (v0.3)
- [ ] **MIDI Support**: Web MIDI API for external controller integration.
- [ ] **Preset System**: JSON-based preset loading and saving.

## 4. Technical Strategy

### Audio Signal Path
```text
[Osc 1] --\
[Osc 2] ----> [Mixer] ---> [Filter] ---> [FX Chain] ---> [Limiter] ---> [Output]
[Sub]   --/
[Noise] -/
```

### Modulation System
Use `Tone.connect` and `Tone.Signal` to route modulation sources. 
- *Challenge*: Real-time updates of wavetable partials can cause clicks. 
- *Solution*: Use dual-oscillator crossfading for smooth "Wavetable Position" morphing.

## 5. Implementation Roadmap
1. **Week 1**: Basic Audio Engine Setup (Tone.js, Polyphony, Basic UI).
2. **Week 2**: Wavetable Implementation & 2D Visualization.
3. **Week 3**: Modulation Matrix & Envelope/LFO Editors.
4. **Week 4**: Effects, Filters, and Preset Management.
5. **Week 5**: UI Polishing, MIDI Support, and Performance Optimization.

## 6. Verification & Testing
- **Unit Tests**: Test modulation math and envelope timing.
- **Performance**: Monitor CPU usage (Web Audio nodes) to ensure polyphony doesn't crackle on mid-range devices.
- **UX**: Verify MIDI latency and knob responsiveness.
