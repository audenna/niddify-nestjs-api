import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      throw new UnauthorizedException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        info?.message || 'Login as a valid user',
      );
    }

    return user;
  }
}
