import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  async getWeatherByCity(city: string) {
    try {
      // Geocoding API call
      const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
      
      const geocodingData = await geocodingResponse.json();

      if (!geocodingData.results || geocodingData.results.length === 0) {
        throw new Error(`No se encontró información para la ciudad ${city}`);
      }

      const { latitude, longitude } = geocodingData.results[0];

      // Weather API call
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,precipitation_probability,precipitation,is_day&forecast_days=1`);

      const weatherData = await weatherResponse.json();
      
      return weatherData;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error.message}`);
    }
  }
}