// import { Module } from '@nestjs/common';
// import { McpModule } from './mcp/mcp.module';
// import { WeatherModule } from './weather/weather.module';

// @Module({
//   imports: [McpModule, WeatherModule],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { WeatherModule } from './core/weather/weather.module';

@Module({
  imports: [WeatherModule],
})
export class AppModule {}