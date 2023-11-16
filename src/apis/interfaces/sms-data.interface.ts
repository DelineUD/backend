export interface SMSData {
  status: string;
  status_code: number;
  sms: Record<string, Uint8Array>;
  balance: number;
}
