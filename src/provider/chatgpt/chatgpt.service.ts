import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class ChatgptService {
  constructor(private appConfig: AppConfigService) {
  }
}

