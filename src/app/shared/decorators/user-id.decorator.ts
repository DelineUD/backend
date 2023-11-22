import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string | null => {
  const req = ctx.switchToHttp().getRequest();
  console.log(req);
  return req.user?._id ? String(req.user?._id) : null;
});
