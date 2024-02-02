import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './entity/user.entity';

export const getUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const { user } = ctx.switchToHttp().getRequest();
  return user;
});
