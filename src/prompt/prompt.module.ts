import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { ProviderModule } from 'src/provider/provider.module';
import { ProviderService } from 'src/provider/provider.service';
import { OllamaService } from 'src/provider/ollama/ollama.service';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
  providers: [
    AppConfigService,
    OllamaService,
    ProviderService,
    PromptService,
  ],
  controllers: [PromptController],
  imports: [ProviderModule],
})
export class PromptModule { }
