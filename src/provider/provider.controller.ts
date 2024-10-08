import { Controller, Get, Optional } from '@nestjs/common';
import { OllamaService } from './ollama/ollama.service';
import { ModelResponse } from 'ollama';

@Controller('provider')
export class ProviderController {
  constructor(
    @Optional()
    private readonly ollamaService: OllamaService,
  ) { }

  @Get('models')
  getModels(): Promise<ModelResponse[]> {
    return this.ollamaService.getModels();
  }

  // @Post('pull')
  // pullModel(@Body() request: { model: string }) {
  //   return this.ollamaService.pullModel(request.model);
  // }
}
