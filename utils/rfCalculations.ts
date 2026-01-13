
import { SPEED_OF_LIGHT, UNIT_MULTIPLIERS } from '../constants';
import { FrequencyUnit } from '../types';

export const convertToHz = (value: number, unit: FrequencyUnit): number => {
  return value * (UNIT_MULTIPLIERS[unit] || 1);
};

export const formatFrequency = (hz: number): string => {
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(3)} GHz`;
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(3)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(3)} kHz`;
  return `${hz.toFixed(0)} Hz`;
};

export const calculateWavelength = (freqHz: number): number => {
  if (freqHz === 0) return 0;
  return SPEED_OF_LIGHT / freqHz;
};

export const calculateAntennaLength = (
  freqHz: number,
  type: 'quarter' | 'half',
  velocityFactor: number = 0.95
): number => {
  const wavelength = calculateWavelength(freqHz);
  const factor = type === 'quarter' ? 0.25 : 0.5;
  return wavelength * factor * velocityFactor;
};

export const dbmToWatts = (dbm: number): number => {
  return Math.pow(10, (dbm - 30) / 10);
};

export const wattsToDbm = (watts: number): number => {
  if (watts <= 0) return -100;
  return 10 * Math.log10(watts) + 30;
};
