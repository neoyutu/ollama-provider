import { ClientCryptoOps, events, QUICClient, QUICStream } from '@matrixai/quic';
import { Injectable, Logger as NestLogger, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from './utils';
import { AppConfigService } from 'src/app-config/app-config.service';
import { HubMessage, HubMessageType, ProviderInfo, ProviderType } from './hub.dto';
import { OllamaService } from './ollama.service';

@Injectable()
export class HubService implements OnModuleInit {
  private logger = new NestLogger(HubService.name)
  private quicClient: QUICClient;
  private quicLogger: Logger;

  constructor(
    private appConfig: AppConfigService,
    private ollamaService: OllamaService,
  ) {
  }

  async onModuleInit() {
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
        await this.handleConnectionStream(this, e);
      }
    );
  }

  getClient() {
    return this.quicClient;
  }

  async handleConnectionStream(thiz: HubService, e: events.EventQUICConnectionStream) {
    const conn = e.detail;

    const decoder = new TextDecoder('utf-8');
    for await (const encRes of conn.readable) {
      let res: HubMessage;
      res = JSON.parse(decoder.decode(encRes));
      this.handleHubMessage(this, conn, res);
    }
  }

  async handleHubMessage(thiz: HubService, conn: QUICStream, msg: HubMessage) {
    switch (msg.type) {
      case HubMessageType.ProviderInfoReq:
        await thiz.handleProviderInfoReq(thiz, conn)
        break;
      default:
        break;
    }
  }

  async handleProviderInfoReq(thiz: HubService, conn: QUICStream) {
    const models = await thiz.ollamaService.getModels();
    const msg: HubMessage = {
      type: HubMessageType.ProviderInfoRes,
      providerInfoRes: {
        providerType: ProviderType.Ollama,
        providerId: this.appConfig.provider_id,
        ollamaProviderDetail: {
          models: models.map((modelRes) => modelRes.name),
        }
      }
    }

    const writer = conn.writable.getWriter();
    const encoder = new TextEncoder();
    const encReq = encoder.encode(JSON.stringify(msg));
    await writer.write(encReq)
  }
}
