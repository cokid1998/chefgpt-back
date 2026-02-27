import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface JWTUser {
  userId: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
