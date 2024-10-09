import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModelResponse, Ollama } from 'ollama'
import { AppConfigService } from 'src/app-config/app-config.service';
import { ChatContent } from 'src/prompt/prompt.dto';

@Injectable()
export class OllamaService implements OnModuleInit {
  private client: Ollama;

  constructor(private appConfig: AppConfigService) {
  }

  async onModuleInit() {
    this.client = new Ollama({
      host: this.appConfig.ollama_host
    })
  }

  async getModels(): Promise<ModelResponse[]> {
    const listResp = await this.client.list();
    return listResp.models
  }

  async pullModel(model: string) {
    await this.client.pull({ model })
  }

  async chat(model: string, content: ChatContent, histories: ChatContent[]) {
    const response = await this.client.chat({
      model,
      messages: [...histories, content],
    });
    return response
  }
}
