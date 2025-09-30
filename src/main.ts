import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StderrLogger } from './stderr-logger';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true, // permite inyectar nuestro logger
  });

  app.useLogger(new StderrLogger()); // logs a stderr
  
  // El servidor MCP se inicia automáticamente cuando el módulo se inicializa
  // No necesitamos escuchar en un puerto HTTP ya que MCP usa stdio
  // console.log('NestJS MCP Server is running...');
  
  // Mantener la aplicación corriendo
  await app.init();
}

bootstrap().catch(console.error);