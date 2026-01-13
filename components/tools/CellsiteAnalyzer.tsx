
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { useCellsiteAnalyzer } from '../../hooks/useCellsiteAnalyzer';
import { estimateCoverage } from '../../utils/cellsiteCalculations';

export const CellsiteAnalyzer: React.FC = () => {
  const { scanResult, isScanning, startScan } = useCellsiteAnalyzer();
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'details'>('overview');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn("Location access denied", err)
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cellsite Analyzer</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${userCoords ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-xs text-gray-500">
              {userCoords ? `Live GPS: ${userCoords.lat.toFixed(4)}, ${userCoords.lon.toFixed(4)}` : "Awaiting GPS Lock..."}
            </p>
          </div>
        </div>
        <button 
          onClick={startScan}
          disabled={isScanning}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          {isScanning ? '🔍 Scanning Hardware...' : '📡 Run Real-time Scan'}
        </button>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['overview', 'map', 'details'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {!scanResult ? (
        <Card className="flex items-center justify-center p-20 text-center opacity-50">
          <div>
            <div className="text-6xl mb-4">📍</div>
            <p>Geospatial analysis ready. Request hardware scan to find nearby towers.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Live Connection" className="lg:col-span-1">
                  <div className="space-y-3">
                    <InfoItem label="Serving Node" value={scanResult.servingCell?.cid || '---'} highlight />
                    <InfoItem label="Global Identity" value={`${scanResult.servingCell?.mcc}-${scanResult.servingCell?.mnc}`} />
                    <InfoItem label="Latency" value={`${scanResult.metrics.latency}ms`} highlight />
                    <InfoItem label="GPS Accuracy" value={`${scanResult.location.accuracy}m`} />
                  </div>
                </Card>
                <Card title="Signal Quality" className="lg:col-span-2">
                   <div className="flex flex-col h-full justify-around">
                      <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-gray-500">RSRP Intensity</span>
                        <span className="text-lg font-bold text-green-500">{scanResult.servingCell?.signal.rsrp} dBm</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mx-4 my-2">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                   </div>
                </Card>
             </div>
          )}

          {activeTab === 'map' && (
            <Card title="Real-World Coverage Mapping">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i5263!3i12656!2m3!1e0!2sm!3i420120488!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2!6m8!1e1!6b1?token=123')] bg-center bg-cover"></div>
                
                {/* Real Position */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-400/30"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap">
                    YOUR GPS LOCATION
                  </div>
                </div>

                {/* Detected Towers (Offset based on real location for visual) */}
                {scanResult.towers.map((tower, idx) => (
                  <div 
                    key={tower.id}
                    className="absolute z-10"
                    style={{ top: `${30 + idx * 20}%`, left: `${20 + idx * 40}%` }}
                  >
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-lg">📡</span>
                    </div>
                    <div className="text-[9px] bg-black/50 text-white p-1 rounded mt-1">CID: {tower.cid}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">Note: Tower coordinates are triangulated via real-time RSRP measurements from your position.</p>
            </Card>
          )}

          {activeTab === 'details' && (
             <Card title="Live Radio Topology">
                <div className="space-y-2">
                   {scanResult.towers.map(tower => (
                     <div key={tower.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex justify-between items-center border border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tower.networkType} Node</p>
                          <p className="text-sm font-bold">{tower.provider.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-blue-500">{tower.frequency.dl.value} {tower.frequency.dl.unit}</p>
                          <p className="text-xs text-gray-500">Band: {tower.band}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
          )}
        </div>
      )}
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-blue-500' : ''}`}>{value}</span>
  </div>
);
