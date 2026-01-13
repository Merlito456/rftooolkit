
import { FrequencyBand } from './types';

export const SPEED_OF_LIGHT = 299792458; // m/s

export const FREQUENCY_BANDS: FrequencyBand[] = [
  { name: 'VLF', start: 3000, end: 30000, allocation: 'Navigation', service: 'Maritime', region: 'Global' },
  { name: 'LF', start: 30000, end: 300000, allocation: 'Amateur, Time Signals', service: 'Navigation', region: 'Global' },
  { name: 'MF', start: 300000, end: 3000000, allocation: 'AM Broadcast', service: 'Maritime/Aviation', region: 'Global' },
  { name: 'HF', start: 3000000, end: 30000000, allocation: 'Amateur, Shortwave', service: 'Military/Maritime', region: 'Global' },
  { name: 'VHF', start: 30000000, end: 300000000, allocation: 'FM Broadcast, Airband', service: 'Aviation/Maritime', region: 'Global' },
  { name: 'UHF', start: 300000000, end: 3000000000, allocation: 'Cellular, WiFi (2.4GHz)', service: 'Public Safety', region: 'Global' },
  { name: 'SHF', start: 3000000000, end: 30000000000, allocation: 'WiFi (5GHz), Satellite', service: 'Commercial', region: 'Global' },
  { name: 'EHF', start: 30000000000, end: 300000000000, allocation: '5G, Radio Astronomy', service: 'Scientific', region: 'Global' },
];

export const UNIT_MULTIPLIERS: Record<string, number> = {
  'Hz': 1,
  'kHz': 1e3,
  'MHz': 1e6,
  'GHz': 1e9,
};
