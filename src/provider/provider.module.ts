import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { HubService } from './hub/hub.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { ProviderController } from './provider.controller';
import { ProviderType } from './hub/hub.dto';
import { OllamaService } from './ollama/ollama.service';
import { ChatgptService } from './chatgpt/chatgpt.service';

@Module({
  providers: [
    AppConfigService,
    {
      provide: 'SERVICE',
      useFactory: (
        appConfig: AppConfigService,
      ) => {
        switch (appConfig.providerType) {
          case ProviderType.Ollama:
            console.log('ollama service');
            return new OllamaService(appConfig);
          case ProviderType.ChatGPT:
            return new ChatgptService(appConfig);
          default:
            throw new Error('unsupported provider');
        }
      },
      inject: [AppConfigService],
    },
    ProviderService,
    HubService,
  ],
  exports: [
    ProviderService,
  ],
  controllers: [ProviderController],
})
export class ProviderModule { }
