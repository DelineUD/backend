import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

export const STRATEGIES = [JwtAccessStrategy, JwtRefreshStrategy];
