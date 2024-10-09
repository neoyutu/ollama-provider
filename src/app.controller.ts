import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OllamaService } from './provider/ollama/ollama.service';
import { ModelResponse } from 'ollama';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
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
