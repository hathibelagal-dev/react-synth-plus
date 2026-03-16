import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterControl from '../components/FilterControl';
import OscillatorControl from '../components/OscillatorControl';
import React from 'react';

describe('UI Components', () => {
    it('FilterControl should trigger onChange', () => {
        const onChange = vi.fn();
        const value = { type: 'lowpass', cutoff: 2000 };
        render(<FilterControl value={value} onChange={onChange} />);
        
        const slider = screen.getByRole('slider');
        fireEvent.input(slider, { target: { value: '5000' } });
        
        expect(onChange).toHaveBeenCalledWith('filter', 'cutoff', 5000);
    });

    it('OscillatorControl should trigger onChange for wavetable', () => {
        const onChange = vi.fn();
        const value = { wavetable: 'basic', wtPos: 0 };
        render(<OscillatorControl value={value} onChange={onChange} />);
        
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'harmonic' } });
        
        expect(onChange).toHaveBeenCalledWith('osc1', 'wavetable', 'harmonic');
    });
});
