export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  type?: string;
}

export interface ILoginSmsPayload {
  phone: string;
  vPass: number;
}
