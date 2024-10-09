import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  readonly port: number;
  readonly ollama_host: string;
  readonly hub: HubConfig;

  constructor(configService: ConfigService) {
    this.port = configService.get<number>('app.port');
    this.ollama_host = configService.get<string>('app.ollama_host');
    this.hub = new HubConfig(configService);
  }
}

export class HubConfig {
  host: string;
  port: number;

  constructor(configService: ConfigService) {
    this.host = configService.get<string>('app.hub.host');
    this.port = configService.get<number>('app.hub.port');
  }
}