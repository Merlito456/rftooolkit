
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Waveform } from '../../types';

export const SignalGenerator: React.FC = () => {
  const [frequency, setFrequency] = useState(1000); // 1kHz default
  const [amplitude, setAmplitude] = useState(0); // 0 dBm default
  const [waveform, setWaveform] = useState<Waveform>('sine');
  const [isEnabled, setIsEnabled] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = isEnabled ? '#3B82F6' : '#9CA3AF';
      ctx.lineWidth = 2;

      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;
      const ampPx = (amplitude + 100) / 110 * (height / 3); // Scaled for visualization

      for (let x = 0; x <= width; x++) {
        const t = (x + offset) / width;
        let y = 0;
        const freqScale = frequency / 500; // Visualization scaling

        if (waveform === 'sine') {
          y = midY + Math.sin(t * Math.PI * 10 * freqScale) * ampPx;
        } else if (waveform === 'square') {
          y = midY + (Math.sin(t * Math.PI * 10 * freqScale) >= 0 ? 1 : -1) * ampPx;
        } else if (waveform === 'triangle') {
          y = midY + (Math.asin(Math.sin(t * Math.PI * 10 * freqScale)) * (2 / Math.PI)) * ampPx;
        } else if (waveform === 'sawtooth') {
          y = midY + (2 * (t * 5 * freqScale - Math.floor(0.5 + t * 5 * freqScale))) * ampPx;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isEnabled) {
        offset += 2;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [frequency, amplitude, waveform, isEnabled]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Generator Controls" className="lg:col-span-1">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Waveform Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['sine', 'square', 'triangle', 'sawtooth'] as Waveform[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWaveform(w)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    waveform === w 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Frequency: <span className="text-blue-600 dark:text-blue-400 mono">{frequency} Hz</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="20000" 
              value={frequency} 
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Amplitude: <span className="text-blue-600 dark:text-blue-400 mono">{amplitude} dBm</span>
            </label>
            <input 
              type="range" 
              min="-100" 
              max="20" 
              value={amplitude} 
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
              isEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isEnabled ? '🔴 RF OUTPUT ON' : '⚪ ENABLE OUTPUT'}
          </button>
        </div>
      </Card>

      <Card title="Live Output Preview" className="lg:col-span-2 overflow-hidden">
        <div className="relative aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="w-full h-full opacity-90"
          />
          <div className="absolute top-4 right-4 flex flex-col items-end space-y-1">
            <div className={`px-2 py-1 rounded text-[10px] font-bold ${isEnabled ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
              {isEnabled ? 'TRANSMITTING' : 'STANDBY'}
            </div>
            <div className="text-[10px] text-gray-500 mono">Visualizer Sample Rate: 44.1kHz</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold">V-Peak</div>
            <div className="text-sm font-bold dark:text-white mono">
              {(Math.sqrt(Math.pow(10, (amplitude - 30) / 10) * 50) * Math.sqrt(2)).toFixed(3)} V
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold">V-RMS</div>
            <div className="text-sm font-bold dark:text-white mono">
              {Math.sqrt(Math.pow(10, (amplitude - 30) / 10) * 50).toFixed(3)} V
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Power</div>
            <div className="text-sm font-bold dark:text-white mono">
              {Math.pow(10, (amplitude - 30) / 10).toExponential(2)} W
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Impedance</div>
            <div className="text-sm font-bold dark:text-white mono">50 Ω</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
