export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  type?: string;
}

export interface ILoginSmsPayload {
  phone: number;
  vPass: number;
}
