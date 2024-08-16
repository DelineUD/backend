import { ISendSmsResponse } from '@app/sms/interfaces/send-sms-response.interface';

export type AuthSendSmsResponseType = Omit<ISendSmsResponse, 'sms' | 'balance'>;
