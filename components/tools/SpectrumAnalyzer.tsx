
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';

export const SpectrumAnalyzer: React.FC = () => {
  const [mode, setMode] = useState<'sim' | 'live'>('sim');
  const [isRunning, setIsRunning] = useState(true);
  const [liveData, setLiveData] = useState<{ freq: number; amp: number }[]>([]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Simulation Logic
  const [simData, setSimData] = useState<{ freq: number; amp: number }[]>([]);

  useEffect(() => {
    if (mode === 'sim' && isRunning) {
      const interval = setInterval(() => {
        const points = 100;
        const newData = Array.from({ length: points }, (_, i) => {
          const f = 2400 + i;
          let amp = -100 + Math.random() * 5;
          if (Math.abs(f - 2437) < 10) amp += 40 * Math.exp(-Math.pow(f - 2437, 2) / 20);
          return { freq: f, amp: parseFloat(amp.toFixed(2)) };
        });
        setSimData(newData);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [mode, isRunning]);

  // Live Microphone Logic
  const startLiveAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const sampleRate = audioCtxRef.current?.sampleRate || 44100;
        const formatted = Array.from(dataArray).map((val, i) => ({
          freq: Math.round((i * sampleRate) / analyserRef.current!.fftSize),
          amp: (val / 255) * 100 - 100 // Scale to dBm-like values
        }));
        
        setLiveData(formatted);
        animationRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (err) {
      console.error("Mic access denied", err);
      setMode('sim');
    }
  };

  useEffect(() => {
    if (mode === 'live') {
      startLiveAudio();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioCtxRef.current?.close();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioCtxRef.current?.close();
    };
  }, [mode]);

  const activeData = mode === 'live' ? liveData : simData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1" title="Analyzer Input">
          <div className="space-y-4">
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button 
                onClick={() => setMode('sim')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'sim' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
              >
                Simulation
              </button>
              <button 
                onClick={() => setMode('live')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'live' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}
              >
                Live Mic
              </button>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${mode === 'live' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                <span className="text-sm font-semibold">{mode === 'live' ? 'Real-time Audio Input' : 'Synthesized Spectrum'}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsRunning(!isRunning)}
              className="w-full py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg font-bold text-sm"
            >
              {isRunning ? 'Pause Feed' : 'Resume Feed'}
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-3" title={mode === 'live' ? "Live Acoustic Spectrum (Hz)" : "Radio Frequency Density (MHz)"}>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="freq" stroke="#9CA3AF" tick={{fontSize: 10}} />
                <YAxis domain={[-100, 0]} stroke="#9CA3AF" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Area type="monotone" dataKey="amp" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmp)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
