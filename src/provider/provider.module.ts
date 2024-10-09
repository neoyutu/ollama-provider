import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ChatGptService } from './chatgpt/chatgpt.service';
import { OllamaService } from './ollama/ollama.service';
import { HubService } from './hub.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { ProviderController } from './provider.controller';

@Module({
  providers: [ProviderService, HubService, AppConfigService],
  exports: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule { }
