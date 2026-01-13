
import React, { useState } from 'react';
import { Card } from '../common/Card';

type PowerUnit = 'dBm' | 'dBW' | 'Watts' | 'mWatts' | 'V-RMS' | 'V-Peak';

export const UnitConverter: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<PowerUnit>('dBm');
  const [impedance, setImpedance] = useState<number>(50);

  // Core conversion to Watts
  const toWatts = (val: number, unit: PowerUnit, z: number): number => {
    switch (unit) {
      case 'dBm': return Math.pow(10, (val - 30) / 10);
      case 'dBW': return Math.pow(10, val / 10);
      case 'Watts': return val;
      case 'mWatts': return val / 1000;
      case 'V-RMS': return Math.pow(val, 2) / z;
      case 'V-Peak': return Math.pow(val / Math.sqrt(2), 2) / z;
      default: return 0;
    }
  };

  const watts = toWatts(value, fromUnit, impedance);

  const format = (v: number) => {
    if (isNaN(v) || !isFinite(v)) return '---';
    if (v === 0) return '0';
    if (Math.abs(v) < 0.001 || Math.abs(v) > 100000) return v.toExponential(4);
    return v.toFixed(4);
  };

  const results: { label: string; value: string; unit: string }[] = [
    { label: 'Power', value: format(10 * Math.log10(watts) + 30), unit: 'dBm' },
    { label: 'Power', value: format(10 * Math.log10(watts)), unit: 'dBW' },
    { label: 'Power', value: format(watts), unit: 'Watts' },
    { label: 'Power', value: format(watts * 1000), unit: 'mWatts' },
    { label: 'Voltage', value: format(Math.sqrt(watts * impedance)), unit: 'V-RMS' },
    { label: 'Voltage', value: format(Math.sqrt(watts * impedance) * Math.sqrt(2)), unit: 'V-Peak' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Input Configuration">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Value</label>
                <input 
                  type="number" 
                  value={value} 
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Unit</label>
                <select 
                  value={fromUnit} 
                  onChange={(e) => setFromUnit(e.target.value as PowerUnit)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 outline-none"
                >
                  <option value="dBm">dBm</option>
                  <option value="dBW">dBW</option>
                  <option value="Watts">Watts</option>
                  <option value="mWatts">mWatts</option>
                  <option value="V-RMS">V-RMS</option>
                  <option value="V-Peak">V-Peak</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">System Impedance (Ω)</label>
              <div className="flex space-x-2">
                {[50, 75, 300, 600].map(z => (
                  <button
                    key={z}
                    onClick={() => setImpedance(z)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                      impedance === z 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {z}Ω
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Conversion Matrix" className="bg-blue-50 dark:bg-blue-900/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((res, i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-900 shadow-sm">
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{res.label}</div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mono truncate">{res.value}</span>
                  <span className="text-xs text-gray-400 font-medium">{res.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card title="Quick Reference Table">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
          {[0.001, 1, 10, 100, 1000, 10000].map(p => (
            <div key={p} className="p-2 border border-gray-100 dark:border-gray-800 rounded">
              <div className="text-[10px] text-gray-400 uppercase">dBm</div>
              <div className="text-xs font-bold dark:text-white">{10 * Math.log10(p) + 30}</div>
              <div className="text-[10px] text-gray-400 uppercase mt-1">Watts</div>
              <div className="text-xs font-bold dark:text-white">{p}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
