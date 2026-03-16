import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Keyboard, FilterControl, useAudioEngine } from 'react-synth-plus';
import 'react-synth-plus/style.css'; // Don't forget the styles!

const MySynth = () => {
  const { isStarted, init, setParam } = useAudioEngine();
  
  // You would manage this state in your app
  const [filterState, setFilterState] = useState({ type: 'lowpass', cutoff: 2000 });

  return (
    <div className="synth-dark-theme">
      {!isStarted ? (
        <button onClick={init}>Start Engine</button>
      ) : (
        <>
          <FilterControl value={filterState} onChange={setParam} />
          <Keyboard />
        </>
      )}
    </div>
  );
};

export default function MyApp() {
    return (
      <div>
        <h1>Welcome to my app</h1>
        <MySynth />
      </div>
    );
  }

  const root = createRoot(document.getElementById('root'))
  root.render(<MyApp />)