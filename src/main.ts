// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: ['error', 'warn', 'log'],
//   });
  
//   // El servidor MCP se inicia automáticamente cuando el módulo se inicializa
//   // No necesitamos escuchar en un puerto HTTP ya que MCP usa stdio
//   console.log('NestJS MCP Server is running...');
  
//   // Mantener la aplicación corriendo
//   await app.init();
// }

// bootstrap().catch(console.error);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS si es necesario
  app.enableCors();
  
  await app.listen(3000);
  console.log('API HTTP corriendo en http://localhost:3000');
  console.log('Endpoints disponibles:');
  // console.log(' GET /weather?city=Lima');
  // console.log(' GET /weather/summary?city=Lima');
}

bootstrap();