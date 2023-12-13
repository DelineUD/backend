import { JwtAccessStrategy } from '@app/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@app/auth/strategies/jwt-refresh.strategy';

export const STRATEGIES = [JwtAccessStrategy, JwtRefreshStrategy];
