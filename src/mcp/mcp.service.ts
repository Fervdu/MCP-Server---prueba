import { Injectable, OnModuleInit } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class McpService implements OnModuleInit {
  private server: McpServer;

  constructor(private weatherService: WeatherService) {
    this.server = new McpServer({
      name: 'NestJS-MCP-Demo',
      version: '1.0.0'
    });
  }

  async onModuleInit() {
    await this.setupTools();
    await this.connectServer();
  }

  private setupTools() {
    this.server.tool(
      'fetch-weather',
      'Tool to fetch the weather of a city - NestJS',
      {
        city: z.string().describe('City name'),
      },
      async ({ city }) => {
        try {
          const weatherData = await this.weatherService.getWeatherByCity(city);
          
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
                text: `Error: ${error.message}`
              }
            ]
          };
        }
      }
    );
  }

  private async connectServer() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Server connected successfully');
  }
}