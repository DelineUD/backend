import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { SMSData } from '@shared/interfaces/sms-data.interface';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly httpService: HttpService) {}

  async send(phone: string, text: string): Promise<SMSData> {
    return (
      await firstValueFrom(
        this.httpService
          .get<SMSData>(process.env.SMS_API, {
            params: {
              api_id: process.env.SMS_API_KEY,
              to: phone,
              msg: new TextEncoder().encode(text),
              json: 1,
            },
          })
          .pipe(
            catchError((err: AxiosError) => {
              this.logger.error(err);
              throw Error(`Error while sms sending: ${err.message}`);
            }),
          ),
      )
    ).data;
  }
}
