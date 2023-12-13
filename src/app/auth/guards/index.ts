import { JwtAuthGuard } from '@app/auth/guards/jwt-access.guard';
import { JwtAuthRefreshGuard } from '@app/auth/guards/jwt-refresh.guard';

export const GUARDS = [JwtAuthGuard, JwtAuthRefreshGuard];
