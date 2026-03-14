# 🎹 ReactSynth+ Examples

This directory contains several examples demonstrating how to use the **ReactSynth+** headless hooks and audio engine in different contexts.

## 🔗 Live Demo
A live, interactive version of the standalone demo is available on CodePen:
👉 **[ReactSynth+ Live Demo](https://codepen.io/hathibelagal-dev/pen/raMyWRp)**

---

## 🚀 Running the Examples

### 1. The Showcase Project (Vite)
The most comprehensive way to explore the project. It runs a dashboard containing the main synth interface and both the `BasicTrigger` and `DroneMachine` examples.

```bash
# From the project root
npm run dev:showcase
```

### 2. Standalone HTML Demo
Demonstrates how to use the library via a UMD bundle in a plain HTML file (no build tools required for the consumer).

1. **Build the library first**:
   ```bash
   npm run build:lib
   ```
2. **Open the file**: Open `examples/standalone.html` directly in your browser.

---

## 📂 File Overview

| File | Description |
| :--- | :--- |
| **`Showcase.jsx`** | A master dashboard combining all components and examples. |
| **`BasicTrigger.jsx`** | The simplest implementation using `useAudioEngine` to trigger notes. |
| **`DroneMachine.jsx`** | Demonstrates automated parameter modulation for ambient soundscapes. |
| **`standalone.html`** | A UMD-based example using Babel standalone for JSX. |

---

## 💡 Key Concepts
All React examples leverage the **Headless Hook** pattern:
- `useAudioEngine`: Manages the lifecycle and core parameters of the synth.
- `useKeyboard`: Manages polyphonic note triggering and QWERTY mapping.
