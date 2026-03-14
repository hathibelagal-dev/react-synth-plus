import React, { useRef, useEffect } from 'react';
import { engine } from '../audio/Engine';

const Visualizer = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            if (!engine.waveform) return;

            const values = engine.waveform.getValue();
            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);
            
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00d2ff';

            for (let i = 0; i < values.length; i++) {
                const x = (i / values.length) * width;
                const y = ((values[i] + 1) / 2) * height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        };

        // Resize handler
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <section className="visualizer-container">
            <canvas ref={canvasRef} id="oscilloscope"></canvas>
        </section>
    );
};

export default Visualizer;
