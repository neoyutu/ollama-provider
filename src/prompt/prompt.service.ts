import { Injectable } from '@nestjs/common';
import { ChatContent, ChatInfo, ModelType, NewChatResDto, UserChat } from './prompt.dto';
import { ProviderService } from 'src/provider/provider.service';
import { Provider } from 'src/provider/provider.dto';
import { OllamaService } from 'src/provider/ollama/ollama.service';
import { v4 as uuidv4 } from 'uuid';

const TOKEN_PRICE = 0.00000000000001;

@Injectable()
export class PromptService {
  private readonly UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

  /// userId -> chatId[]
  private userChats: Map<string, string[]> = new Map();
  /// chatId
  private chatInfos: Map<string, ChatInfo> = new Map();
  /// chatId -> 
  private chatHistories: Map<string, ChatContent[]> = new Map();

  constructor(
    private providerService: ProviderService,
  ) {
    // mock providers
    const provider: Provider = {
      id: "hehe",
      model: ModelType.Qwen2_05b,
    };
    this.providerService.registerProvider(provider)
  }

  async newChat(user_id: string, model: ModelType): Promise<NewChatResDto> {
    const chatId = uuidv4();

    // Initialize an empty array of chat messages for this chat
    this.userChats.set(user_id,
      this.userChats.get(user_id) === undefined ?
        [] : [...this.userChats.get(user_id), chatId])
    this.chatInfos.set(chatId, { model, chatId });
    this.chatHistories.set(chatId, []);

    const response: NewChatResDto = {
      chat_id: chatId,
      model,
    };
    return response;
  }

  async processPrompt(userId: string, chatId: string, model: ModelType, prompt: string) {
    if (!this.chatInfos.get(chatId)) {
      throw new Error('Unexisting chatId');
    }

    if (!Object.values(ModelType).includes(model)) {
      throw new Error('Invalid model type');
    }

    // update model changes
    let chatInfo = this.chatInfos.get(chatId);
    if (model !== chatInfo.model) {
      chatInfo.model = model;
      this.chatInfos.set(chatId, chatInfo);
    }

    // update chat title
    if (!chatInfo.chatTitle) {
      chatInfo.chatTitle = prompt.length <= 25 ? prompt : prompt.slice(0, 24);
      this.chatInfos.set(chatId, chatInfo);
    }

    let chatHistories = this.chatHistories.get(chatId);
    console.log(chatHistories);

    let providers = this.providerService.findProvidersByModel(model);
    if (providers.length == 0) {
      throw new Error('No providers for model found');
    }

    // take the first
    let provider = providers[0];
    let response: string;
    let totalTokenCount= 0;
    switch (provider.model) {
      case ModelType.Qwen2_05b:
        let chatService = new OllamaService();
        let content: ChatContent = {
          role: 'user',
          content: prompt,
        }
        let res = await chatService.chat(provider.model, content, chatHistories);
        response = res.message.content
        totalTokenCount = res.prompt_eval_count + res.eval_count;

        // save message to history
        let assistantContent: ChatContent = {
          role: 'assistant',
          content: response,
        }
        this.chatHistories.set(chatId, [...chatHistories, content, assistantContent]);
        break;
      default:
        break;
    }

    const tokenCount = this.calculateTokenCount(prompt);
    const tokenPrice = this.calculateTokenPrice(tokenCount);

    return {
      user_id: userId,
      model: model,
      prompt: prompt,
      response: response,
      token_count: totalTokenCount,
      token_price: TOKEN_PRICE,
    };
  }

  private calculateTokenCount(prompt: string): number {
    // Example calculation for token count (could be based on prompt length)
    return prompt.length; // Simple assumption: 1 token per character
  }

  private calculateTokenPrice(tokenCount: number): number {
    // Example calculation for token price
    const pricePerToken = 0.0005; // Adjust this price per token as needed
    return tokenCount * pricePerToken;
  }
}
