import axios from 'axios';
import { SMSData } from './interfaces/sms-data.interface';

export async function send(phone: number, text: string): Promise<SMSData> {
  try {
    return (
      await axios.get<SMSData>(process.env.SMS_API, {
        params: {
          api_id: process.env.SMS_API_KEY,
          to: phone,
          msg: new TextEncoder().encode(text),
          json: 1,
        },
      })
    ).data;
  } catch (err) {
    throw Error(`Error while sms sending: ${err.message}`);
  }
}
