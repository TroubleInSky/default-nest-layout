import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { IJwtPayload } from '../../../common/interfaces/common/jwt-payload.interface';
import { appConfigInstance } from '../../../infrastructure/app-config/app-config.infrastructure';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let token =
        (
          context.switchToHttp().getRequest() as Request
        ).headers.authorization?.split(' ')[1] ||
        (
          context.switchToHttp().getRequest() as Request
        ).body?.accessToken?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }
      const decodedAccessToken: IJwtPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: appConfigInstance.ACCESS_TOKEN_SECRET,
        },
      );
      if (!decodedAccessToken) {
        throw new UnauthorizedException();
      }
      const request = context.switchToHttp().getRequest();
      request.user = decodedAccessToken;

      return true;
    } catch (ex) {
      throw new UnauthorizedException();
    }
  }
}
