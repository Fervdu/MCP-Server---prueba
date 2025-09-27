import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  providers: [McpService],
})
export class McpModule {}