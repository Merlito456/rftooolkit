
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { calculateWavelength, calculateAntennaLength, convertToHz } from '../../utils/rfCalculations';
import { FrequencyUnit } from '../../types';

export const RfCalculator: React.FC = () => {
  const [freq, setFreq] = useState(144);
  const [unit, setUnit] = useState<FrequencyUnit>('MHz');
  const [vf, setVf] = useState(0.95);

  const hz = convertToHz(freq, unit);
  const wavelength = calculateWavelength(hz);
  const halfWave = calculateAntennaLength(hz, 'half', vf);
  const quarterWave = calculateAntennaLength(hz, 'quarter', vf);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Antenna Designer">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Frequency</label>
              <input 
                type="number" 
                value={freq} 
                onChange={e => setFreq(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Unit</label>
              <select 
                value={unit} 
                onChange={e => setUnit(e.target.value as FrequencyUnit)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none"
              >
                <option value="Hz">Hz</option>
                <option value="kHz">kHz</option>
                <option value="MHz">MHz</option>
                <option value="GHz">GHz</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Velocity Factor (k)</label>
            <input 
              type="number" 
              step="0.01"
              value={vf} 
              onChange={e => setVf(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500 italic">Standard: Coax (0.66-0.8), Wire in air (0.95)</p>
          </div>
        </div>
      </Card>

      <Card title="Results" className="bg-blue-50 dark:bg-blue-900/10">
        <div className="space-y-4">
          <ResultItem label="Full Wavelength (λ)" value={`${wavelength.toFixed(4)} meters`} />
          <ResultItem label="Half-Wave Dipole" value={`${halfWave.toFixed(4)} meters`} />
          <ResultItem label="Quarter-Wave Vertical" value={`${quarterWave.toFixed(4)} meters`} />
          <ResultItem label="Imperial Wavelength" value={`${(wavelength * 3.28084).toFixed(4)} feet`} />
          <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Design Insight</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              For a center-fed dipole at {freq} {unit}, each leg should be {(halfWave / 2).toFixed(4)} meters long.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ResultItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mono">{value}</span>
  </div>
);
