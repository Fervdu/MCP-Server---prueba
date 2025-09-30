import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class StderrLogger extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}
