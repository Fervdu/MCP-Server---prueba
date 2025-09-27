import { Injectable } from '@nestjs/common';

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    rain: string;
    precipitation_probability: string;
    precipitation: string;
    is_day: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    rain: number[];
    precipitation_probability: number[];
    precipitation: number[];
    is_day: number[];
  };
}

@Injectable()
export class WeatherService {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      // 1. Obtener coordenadas de la ciudad
      const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      
      if (!geocodingResponse.ok) {
        throw new Error(`Geocoding API error: ${geocodingResponse.status}`);
      }

      const geocodingData = await geocodingResponse.json();

      if (!geocodingData.results || geocodingData.results.length === 0) {
        throw new Error(`Ciudad "${city}" no encontrada`);
      }

      const { latitude, longitude } = geocodingData.results[0];

      // 2. Obtener datos meteorológicos
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,precipitation_probability,precipitation,is_day&forecast_days=1&timezone=auto`);

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      return weatherData;

    } catch (error) {
      throw new Error(`Error obteniendo clima para "${city}": ${error.message}`);
    }
  }

  formatWeatherSummary(weatherData: WeatherData, city: string): string {
    const currentHour = new Date().getHours();
    const temp = weatherData.hourly.temperature_2m[currentHour] || weatherData.hourly.temperature_2m[0];
    const rain = weatherData.hourly.rain[currentHour] || weatherData.hourly.rain[0];
    const precipitation = weatherData.hourly.precipitation_probability[currentHour] || weatherData.hourly.precipitation_probability[0];

    return `🌤️ Clima en ${city}:
    Coordenadas: ${weatherData.latitude}°N, ${weatherData.longitude}°E
    Temperatura actual: ${temp}°C
    Lluvia: ${rain}mm
    Probabilidad de precipitación: ${precipitation}%
    Timezone: ${weatherData.timezone}`;
  }
}