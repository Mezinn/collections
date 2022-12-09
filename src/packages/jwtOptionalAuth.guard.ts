import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  public handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    return user;
  }
}
