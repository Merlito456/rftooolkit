
import { useState, useCallback } from 'react';
import { NetworkScanResult, CellTower } from '../types';

const MOCK_TOWERS: CellTower[] = [
  {
    id: 'cell-1', mcc: 310, mnc: 410, lac: 12345, cid: 67890, pci: 123, tac: 45678,
    band: 'B2', networkType: 'LTE', duplex: 'FDD',
    frequency: { dl: { value: 1930, unit: 'MHz' }, ul: { value: 1850, unit: 'MHz' }, bandwidth: 20 },
    signal: { rssi: -65, rsrp: -85, rsrq: -12, sinr: 22 },
    location: { lat: 37.7749, lon: -122.4194, azimuth: 120, beamwidth: 65, range: 1500 },
    provider: { name: 'AT&T', country: 'US', network: 'AT&T Mobility' }
  },
  {
    id: 'cell-2', mcc: 310, mnc: 260, lac: 11111, cid: 22222, pci: 456, tac: 55555,
    band: 'n71', networkType: 'NR', duplex: 'FDD',
    frequency: { dl: { value: 600, unit: 'MHz' }, ul: { value: 600, unit: 'MHz' }, bandwidth: 10 },
    signal: { rssi: -72, rsrp: -98, rsrq: -15, sinr: 14 },
    location: { lat: 37.7800, lon: -122.4250, azimuth: 0, beamwidth: 120, range: 3000 },
    provider: { name: 'T-Mobile', country: 'US', network: 'T-Mobile US' }
  }
];

export const useCellsiteAnalyzer = () => {
  const [scanResult, setScanResult] = useState<NetworkScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState<NetworkScanResult[]>([]);

  const startScan = useCallback(async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result: NetworkScanResult = {
      towers: MOCK_TOWERS,
      servingCell: MOCK_TOWERS[0],
      neighborCells: [MOCK_TOWERS[1]],
      scanTime: Date.now(),
      location: { lat: 37.7749, lon: -122.4194, accuracy: 35 },
      metrics: {
        downloadSpeed: 52.4,
        uploadSpeed: 14.8,
        latency: 32,
        jitter: 4
      }
    };
    
    setScanResult(result);
    setHistory(prev => [result, ...prev].slice(0, 10));
    setIsScanning(false);
  }, []);

  return { scanResult, isScanning, startScan, history };
};
