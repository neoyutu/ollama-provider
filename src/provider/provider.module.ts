import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ChatGptService } from './chatgpt/chatgpt.service';
import { OllamaService } from './ollama.service';
import { HubService } from './hub.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { ProviderController } from './provider.controller';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  providers: [
    AppConfigService,
    OllamaService,
    ProviderService,
    HubService,
  ],
  exports: [
    OllamaService,
    ProviderService,
  ],
  controllers: [ProviderController],
})
export class ProviderModule { }
