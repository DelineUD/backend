export interface ISendSmsResponse {
  status: string;
  status_code: number;
  sms: Record<string, Uint8Array>;
  balance: number;
}
