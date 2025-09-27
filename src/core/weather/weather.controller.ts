import { Controller, Get, Query, BadRequestException, Post, Body } from '@nestjs/common';
import { WeatherService, WeatherData } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Post()
  async getWeather(@Body('city') city: string): Promise<WeatherData> {
    if (!city) {
      throw new BadRequestException('El parámetro "city" es requerido');
    }

    console.log("entro en controller post");
    
    return await this.weatherService.getWeatherByCity(city);
  }

//   @Get('summary')
//   async getWeatherSummary(@Query('city') city: string): Promise<{ summary: string }> {
//     if (!city) {
//       throw new BadRequestException('El parámetro "city" es requerido');
//     }
    
//     const weatherData = await this.weatherService.getWeatherByCity(city);
//     const summary = this.weatherService.formatWeatherSummary(weatherData, city);
    
//     return { summary };
//   }
}