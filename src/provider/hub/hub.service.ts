import { ClientCryptoOps, events, QUICClient, QUICStream } from '@matrixai/quic';
import { Injectable, Logger as NestLogger, OnModuleInit, Optional } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from '../utils';
import { AppConfigService } from 'src/app-config/app-config.service';
import { HubMessage, HubMessageType, ProviderType } from './hub.dto';
import { OllamaService } from '../ollama/ollama.service';
import { ChatgptService } from '../chatgpt/chatgpt.service';

@Injectable()
export class HubService implements OnModuleInit {
  private logger = new NestLogger(HubService.name)
  private quicLogger: Logger;

  quicClient: QUICClient;

  constructor(
    private appConfig: AppConfigService,
    @Optional() private ollamaService: OllamaService,
    @Optional() private chatgpt: ChatgptService,
  ) {
  }

  async onModuleInit() {
    await this.setupQuic();
  }

  async setupQuic() {
    this.logger.log('Connecting to quic server');
    const clientCryptoOps: ClientCryptoOps = {
      randomBytes: testsUtils.randomBytes,
    };
    this.quicLogger = new Logger(`${QUICClient.name} Test`, LogLevel.INFO, [
      new StreamHandler(
        formatting.format`${formatting.level}: ${formatting.keys}: ${formatting.msg}`,
      ),
    ]);
    this.quicClient = await QUICClient.createQUICClient({
      host: this.appConfig.hub.host,
      port: this.appConfig.hub.port,
      localHost: '::',
      crypto: {
        ops: clientCryptoOps,
      },
      logger: this.quicLogger.getChild(QUICClient.name),
      config: {
        verifyPeer: false,
      },
    });
    this.logger.log('Created quic client');

    this.quicClient.connection.addEventListener(
      events.EventQUICConnectionStream.name,
      async (e: events.EventQUICConnectionStream) => {
        this.handleConnectionStream.bind(this);
        await this.handleConnectionStream(e);
      }
    );
  }

  async handleConnectionStream(e: events.EventQUICConnectionStream) {
    const conn = e.detail;

    const decoder = new TextDecoder('utf-8');
    for await (const encRes of conn.readable) {
      let res: HubMessage;
      res = JSON.parse(decoder.decode(encRes));
      this.handleHubMessage(conn, res);
    }
  }

  async handleHubMessage(conn: QUICStream, msg: HubMessage) {
    switch (msg.type) {
      case HubMessageType.ProviderInfoReq:
        await this.handleProviderInfoReq(conn)
        break;
      default:
        break;
    }
  }

  async handleProviderInfoReq(conn: QUICStream) {
    let msg: HubMessage;
    switch (this.appConfig.providerType) {
      case ProviderType.Ollama:
        const models = await this.ollamaService.getModels();
        msg = {
          type: HubMessageType.ProviderInfoRes,
          providerInfoRes: {
            providerType: ProviderType.Ollama,
            providerId: this.appConfig.providerId,
            ollamaProviderDetail: {
              models: models.map((modelRes) => modelRes.name),
            }
          }
        }
        break;
      case ProviderType.ChatGPT:
        msg = {
          type: HubMessageType.ProviderInfoRes,
          providerInfoRes: {
            providerType: ProviderType.ChatGPT,
            providerId: this.appConfig.providerId,
            chatgptProviderDetail: {
              // TODO: get this?
              models: [],
            }
          }
        }
      default:
        throw new Error("unsupported provider type")
    }

    const writer = conn.writable.getWriter();
    const encoder = new TextEncoder();
    const encReq = encoder.encode(JSON.stringify(msg));
    await writer.write(encReq)
  }
}
