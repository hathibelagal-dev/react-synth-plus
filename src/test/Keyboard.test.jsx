import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Keyboard from '../components/Keyboard';
import { engine } from '../audio/Engine';

describe('Keyboard Component', () => {
    beforeEach(async () => {
        engine.isStarted = false;
        await engine.init();
        vi.spyOn(engine, 'playNote');
        vi.spyOn(engine, 'stopNote');
    });

    it('should render all keys', () => {
        render(<Keyboard subOctave={-2} />);
        const keys = screen.getAllByText(/[A-Z]/);
        expect(keys.length).toBe(13); // Number of notes defined in Keyboard.jsx
    });

    it('should trigger playNote on mouse down', () => {
        render(<Keyboard subOctave={-2} />);
        const firstKey = screen.getByText('A'); // C4 note
        fireEvent.mouseDown(firstKey.parentElement);
        expect(engine.playNote).toHaveBeenCalledWith('C4', -2);
    });

    it('should trigger stopNote on mouse up', () => {
        render(<Keyboard subOctave={-2} />);
        const firstKey = screen.getByText('A');
        fireEvent.mouseDown(firstKey.parentElement);
        fireEvent.mouseUp(firstKey.parentElement);
        expect(engine.stopNote).toHaveBeenCalledWith('C4', -2);
    });

    it('should handle keyboard events', () => {
        render(<Keyboard subOctave={-2} />);
        fireEvent.keyDown(window, { key: 'a' });
        expect(engine.playNote).toHaveBeenCalledWith('C4', -2);
        
        fireEvent.keyUp(window, { key: 'a' });
        expect(engine.stopNote).toHaveBeenCalledWith('C4', -2);
    });
});
