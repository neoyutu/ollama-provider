import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderType } from 'src/provider/hub/hub.dto';

@Injectable()
export class AppConfigService {
  readonly providerType: ProviderType;
  readonly port: number;
  readonly providerId: string;
  readonly hub: HubConfig;
  readonly ollama?: OllamaConfig;
  readonly chatgpt?: ChatGPTConfig;

  constructor(configService: ConfigService) {
    if (configService.get<any>('ollama')) {
      this.providerType = ProviderType.Ollama;
    } else if (configService.get<any>('chatgpt')) {
      this.providerType = ProviderType.ChatGPT;
    } else {
      throw new Error('unknown provider config');
    }

    this.port = configService.get<number>('app.port');
    this.providerId = configService.get<string>('app.provider_id');
    this.hub = new HubConfig(configService);
    this.ollama = new OllamaConfig(configService);
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

export class OllamaConfig {
  readonly ollama_host: string;

  constructor(configService: ConfigService) {
    this.ollama_host = configService.get<string>('ollama.ollama_host');
  }
}

export class ChatGPTConfig {
  constructor(configService: ConfigService) {

  }
}