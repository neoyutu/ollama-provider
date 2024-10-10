import { ModelType } from "src/prompt/prompt.dto";

export class HubMessage {
  type: HubMessageType

  providerInfoReq?: null // req without body
  providerInfoRes?: ProviderInfo // req without body
}

export enum HubMessageType {
  ProviderInfoReq,
  ProviderInfoRes,
}

export class ProviderInfo {
  providerType: ProviderType
  providerId: string
  ollamaProviderDetail?: OllamaProviderDetail
  chatgptProviderDetail?: OllamaProviderDetail
}

export enum ProviderType {
  Ollama,
  ChatGPT,
}

export class OllamaProviderDetail {
  models: string[]
}

export class ChatgptProviderDetail {
  models: string[]
}

export class Provider {
  id: string;
  model: ModelType;
}
