import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
// import { PromptModule } from './prompt/prompt.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          const file = fs.readFileSync('config.yml', 'utf8');
          return yaml.parse(file);
        },
      ],
      isGlobal: true,
    }),
    AppConfigModule,
    ProviderModule,
    // PromptModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule { }
