import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModelResponse, Ollama } from 'ollama'
import { AppConfigService } from 'src/app-config/app-config.service';
import { ChatContent } from 'src/provider/prompt/prompt.dto';

@Injectable()
export class OllamaService implements OnModuleInit {
  private client: Ollama;

  constructor(private appConfig: AppConfigService) {
  }

  async onModuleInit() {
    this.client = new Ollama({
      host: this.appConfig.ollama.ollama_host
    })

    try {
      await this.client.ps()
    } catch (error) {
      throw new Error(`Ollama backend is unreachable: ${error}`)
    }
  }

  getClient(): Ollama {
    return this.client
  }

  async getModels(): Promise<ModelResponse[]> {
    const listResp = await this.client.list();
    return listResp.models
  }

  async pullModel(model: string) {
    await this.client.pull({ model })
  }
}
