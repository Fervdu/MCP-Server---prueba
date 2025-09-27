import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Importar solo la lógica de negocio, sin la infraestructura de NestJS
class WeatherService {
  async getWeatherByCity(city) {
    try {
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!geocodingResponse.ok) {
        throw new Error(`Geocoding API error: ${geocodingResponse.status}`);
      }

      const geocodingData = await geocodingResponse.json();

      if (!geocodingData.results || geocodingData.results.length === 0) {
        throw new Error(`Ciudad "${city}" no encontrada`);
      }

      const { latitude, longitude } = geocodingData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,precipitation_probability,precipitation,is_day&forecast_days=1&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      return await weatherResponse.json();

    } catch (error) {
      throw new Error(`Error obteniendo clima para "${city}": ${error.message}`);
    }
  }

  formatWeatherSummary(weatherData, city) {
    const currentHour = new Date().getHours();
    const temp = weatherData.hourly.temperature_2m[currentHour] || weatherData.hourly.temperature_2m[0];
    const rain = weatherData.hourly.rain[currentHour] || weatherData.hourly.rain[0];
    const precipitation = weatherData.hourly.precipitation_probability[currentHour] || weatherData.hourly.precipitation_probability[0];

    return `🌤️ Clima en ${city}:
📍 Coordenadas: ${weatherData.latitude}°N, ${weatherData.longitude}°E
🌡️ Temperatura actual: ${temp}°C
🌧️ Lluvia: ${rain}mm
☔ Probabilidad de precipitación: ${precipitation}%
⏰ Timezone: ${weatherData.timezone}`;
  }
}

async function main() {
  const weatherService = new WeatherService();
  
  const server = new McpServer({
    name: 'weather-mcp-server',
    version: '1.0.0'
  });

  // Herramienta 1: Obtener datos completos del clima
  server.tool(
    'fetch-weather',
    'Obtiene información meteorológica completa de una ciudad',
    {
      city: z.string().describe('Nombre de la ciudad (ej: "Lima", "Madrid", "New York")'),
    },
    async ({ city }) => {
      try {
        const weatherData = await weatherService.getWeatherByCity(city);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(weatherData, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${error.message}`
            }
          ]
        };
      }
    }
  );

  // Herramienta 2: Obtener resumen del clima
  server.tool(
    'weather-summary',
    'Obtiene un resumen legible del clima actual de una ciudad',
    {
      city: z.string().describe('Nombre de la ciudad (ej: "Lima", "Madrid", "New York")'),
    },
    async ({ city }) => {
      try {
        const weatherData = await weatherService.getWeatherByCity(city);
        const summary = weatherService.formatWeatherSummary(weatherData, city);
        
        return {
          content: [
            {
              type: 'text',
              text: summary
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${error.message}`
            }
          ]
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(() => process.exit(1));