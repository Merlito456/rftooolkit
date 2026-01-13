
import { CellTower } from '../types';

export const calculateDistance = (
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export const estimateCoverage = (tower: CellTower, userLoc: { lat: number; lon: number }) => {
  const distance = calculateDistance(tower.location.lat, tower.location.lon, userLoc.lat, userLoc.lon);
  
  // Simplified path loss
  const frequencyHz = tower.frequency.dl.value * 1e6;
  const pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(frequencyHz) - 147.55;
  const estimatedSignal = (tower.signal.rsrp || -85) - Math.max(0, pathLoss / 10);
  
  return {
    distance: Math.round(distance),
    estimatedSignal: Math.round(estimatedSignal),
    quality: estimatedSignal > -95 ? 'Good' : estimatedSignal > -110 ? 'Fair' : 'Poor'
  };
};
