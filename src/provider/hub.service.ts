import { ClientCryptoOps, QUICClient } from '@matrixai/quic';
import { Injectable, Logger as NestLogger, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from './utils';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class HubService implements OnModuleInit {
  private logger = new NestLogger(HubService.name)
  private quicClient: QUICClient;
  private quicLogger: Logger;

  constructor(private appConfig: AppConfigService) {
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

    // const stream = client.connection.newStream();
    // const writer = stream.writable.getWriter();
    // const str = "Hello from client";
    // const encoder = new TextEncoder();
    // const uint8Array = encoder.encode(str);
    // await writer.write(uint8Array);
  }

  getClient() {
    return this.quicClient;
  }
}
