import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  providers: [PromptService],
  controllers: [PromptController],
  imports: [ProviderModule],
})
export class PromptModule { }
