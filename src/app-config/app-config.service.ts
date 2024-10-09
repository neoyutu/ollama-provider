import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService implements OnModuleInit {
  readonly port: number;
  readonly provider_id: string;
  readonly ollama_host: string;
  readonly hub: HubConfig;

  constructor(configService: ConfigService) {
    this.port = configService.get<number>('app.port');
    this.provider_id = configService.get<string>('app.provider_id');
    this.ollama_host = configService.get<string>('app.ollama_host');
    this.hub = new HubConfig(configService);
  }

  onModuleInit() {
    console.log(this);
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