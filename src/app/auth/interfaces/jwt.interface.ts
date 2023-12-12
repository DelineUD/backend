import { Types } from 'mongoose';

export interface IJwtPayload {
  _id: Types.ObjectId;
  phone: number;
  email: string;

  iat: number;
  exp: number;
}

export type IJwtAccessValidPayload = Omit<IJwtPayload, 'iat' | 'exp'>;
export type IJwtRefreshValidPayload = Omit<IJwtPayload, 'iat' | 'exp'> & { refreshToken: string };
