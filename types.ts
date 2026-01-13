
export type FrequencyUnit = 'Hz' | 'kHz' | 'MHz' | 'GHz';
export type PowerUnit = 'dBm' | 'W' | 'mW' | 'µW';
export type Waveform = 'sine' | 'square' | 'triangle' | 'sawtooth';

export type NetworkType = '2G' | '3G' | '4G' | '5G' | 'LTE' | 'NR';
export type SignalQuality = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Signal';
export type DuplexMode = 'FDD' | 'TDD';

// Fixed: Added missing FrequencyBand interface for constants.ts
export interface FrequencyBand {
  name: string;
  start: number;
  end: number;
  allocation: string;
  service: string;
  region: string;
}

export interface FrequencyValue {
  value: number;
  unit: FrequencyUnit;
}

export interface SpectrumData {
  frequencies: number[];
  amplitudes: number[];
  timestamp: number;
}

export interface CellTower {
  id: string;
  mcc: number;
  mnc: number;
  lac: number;
  cid: number;
  pci?: number;
  tac?: number;
  band: string;
  networkType: NetworkType;
  duplex: DuplexMode;
  frequency: {
    dl: FrequencyValue;
    ul: FrequencyValue;
    bandwidth: number;
  };
  signal: {
    rssi: number;
    rsrp: number;
    rsrq: number;
    sinr: number;
    rscp?: number;
    ecio?: number;
  };
  location: {
    lat: number;
    lon: number;
    azimuth: number;
    beamwidth: number;
    range: number;
  };
  provider: {
    name: string;
    country: string;
    network: string;
  };
}

export interface NetworkScanResult {
  towers: CellTower[];
  servingCell: CellTower | null;
  neighborCells: CellTower[];
  scanTime: number;
  location: {
    lat: number;
    lon: number;
    accuracy: number;
  };
  metrics: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
