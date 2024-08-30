import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext): Types.ObjectId | null => {
  const req = ctx.switchToHttp().getRequest();
  return req.user?._id ? new Types.ObjectId(req.user?._id) : null;
});
