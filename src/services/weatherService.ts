import { WeatherRecord } from '../types';

/**
 * Mock Weather Service for Long Beach
 * In a real app, this would fetch from OpenWeatherMap or similar.
 */
export const fetchLongBeachWeather = async (date: string): Promise<WeatherRecord> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data for Long Beach (Avg April temps: 15-20°C)
  return {
    id: `lb-${date}`,
    date,
    tempMax: 22 + Math.random() * 5,
    tempMin: 12 + Math.random() * 5,
    solarRadiation: 18 + Math.random() * 5, // MJ/m^2/day
    windSpeed: 3 + Math.random() * 2, // m/s
    humidity: 65 + Math.random() * 10, // %
    et0: 4.5 + Math.random() * 1.5 // mm/day (Reference ET)
  };
};
