
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SpectrumAnalyzer } from './components/tools/SpectrumAnalyzer';
import { RfCalculator } from './components/tools/RfCalculator';
import { AiAssistant } from './components/tools/AiAssistant';
import { SignalGenerator } from './components/tools/SignalGenerator';
import { UnitConverter } from './components/tools/UnitConverter';
import { CellsiteAnalyzer } from './components/tools/CellsiteAnalyzer';
import { FREQUENCY_BANDS } from './constants';
import { Card } from './components/common/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard title="Active Sensors" value="12" sub="Across 3 Nodes" icon="📡" color="blue" />
        <StatCard title="Spectrum Load" value="42%" sub="Normal Conditions" icon="📊" color="green" />
        <StatCard title="Critical Alerts" value="0" sub="All clear" icon="⚠️" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Antenna Ref" className="h-full">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Quick 1/4 wave vertical lengths (in meters) for common bands:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '2.4 GHz (WiFi)', val: '0.029' },
                { label: '915 MHz (LoRa)', val: '0.078' },
                { label: '433 MHz (ISM)', val: '0.165' },
                { label: '144 MHz (2m)', val: '0.495' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">{item.label}</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mono">{item.val}m</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card title="Live Network Map Preview">
          <div className="h-40 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🗺️</div>
              <p className="text-xs text-gray-500">GIS Telemetry disabled in demo mode.</p>
              <button className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Connect to SDR Node</button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Global Frequency Allocation Reference">
        <div className="overflow-x-auto -mx-6">
          <div className="min-w-[600px] px-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Band</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Range</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Primary Allocation</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Services</th>
                </tr>
              </thead>
              <tbody>
                {FREQUENCY_BANDS.map((band, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400">{band.name}</td>
                    <td className="py-4 px-4 text-xs mono">
                      {band.start >= 1e9 ? `${band.start/1e9}GHz` : band.start >= 1e6 ? `${band.start/1e6}MHz` : `${band.start/1e3}kHz`} - 
                      {band.end >= 1e9 ? `${band.end/1e9}GHz` : band.end >= 1e6 ? `${band.end/1e6}MHz` : `${band.end/1e3}kHz`}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-700 dark:text-gray-300">{band.allocation}</td>
                    <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400">{band.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; sub: string; icon: string; color: 'blue' | 'green' | 'yellow' }> = ({ title, value, sub, icon, color }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h4 className="text-2xl lg:text-3xl font-bold dark:text-white mb-1">{value}</h4>
        <p className="text-[10px] lg:text-xs text-gray-400">{sub}</p>
      </div>
      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-xl lg:text-2xl ${
        color === 'blue' ? 'bg-blue-100 text-blue-600' :
        color === 'green' ? 'bg-green-100 text-green-600' :
        'bg-yellow-100 text-yellow-600'
      }`}>
        {icon}
      </div>
    </div>
  </Card>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/spectrum" element={<SpectrumAnalyzer />} />
                <Route path="/cellsite" element={<CellsiteAnalyzer />} />
                <Route path="/calculator" element={<RfCalculator />} />
                <Route path="/assistant" element={<AiAssistant />} />
                <Route path="/generator" element={<SignalGenerator />} />
                <Route path="/converter" element={<UnitConverter />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
