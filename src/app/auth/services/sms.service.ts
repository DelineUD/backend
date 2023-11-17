import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SMSData } from '../../../apis/interfaces/sms-data.interface';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async send(phone: number, text: string): Promise<SMSData> {
    try {
      return (
        await firstValueFrom(
          this.httpService
            .post(process.env.SMS_API, null, {
              params: {
                api_id: process.env.SMS_API_KEY,
                to: phone,
                msg: new TextEncoder().encode(text),
                json: 1,
              },
            })
            .pipe(),
        )
      ).data;
    } catch (err) {
      throw new BadRequestException(`Error while sms sending: ${err.message}`);
    }
  }
}
