import { JwtAuthGuard } from './jwt-access.guard';
import { JwtAuthRefreshGuard } from './jwt-refresh.guard';

export const GUARDS = [JwtAuthGuard, JwtAuthRefreshGuard];
