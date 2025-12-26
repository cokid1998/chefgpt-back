import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

// JWT토큰이 없어도 API를 사용해야하는 Guard
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(error, user, info) {
    return user || null;
  }
}
