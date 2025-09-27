import { Module } from '@nestjs/common';
import { McpModule } from './mcp/mcp.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [McpModule, WeatherModule],
})
export class AppModule {}