import { JUST_USER, SKIP_AUTH, SKIP_AUTH_REFRESH } from '@common/constants';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { TokenType } from '../enums';
import { TokenService } from '../services';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtAdminGuard');
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {
    super();
  }

  /**
   * Verify the token is valid
   * @param context {ExecutionContext}
   * @returns super.canActivate(context)
   */
  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    const justUser = this.reflector.getAllAndOverride<boolean>(JUST_USER, [
      context.getHandler(),
      context.getClass(),
    ]);

    const skipAuthRefresh = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_REFRESH,
      [context.getHandler(), context.getClass()],
    );
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );

    if (skipAuthRefresh) {
      return true;
    }

    if (skipAuth) {
      // if (accessToken) {
      //   return super.canActivate(context);
      // } else {
      return super.canActivate(context);
      // return true;
      // }
    }

    if (!accessToken) {
      throw new UnauthorizedException('Access token expired');
    }

    const payload = this.tokenService.verifyToken(
      accessToken,
      TokenType.AccessToken,
    );

    if (!payload) {
      throw new UnauthorizedException();
    }
    if (justUser) {
      return super.canActivate(context);
    }

    return super.canActivate(context);
  }

  /**
   * Handle request and verify if exist an error or there's not user
   * @param error
   * @param user
   * @returns user || error
   */
  handleRequest(error: any, user: any) {
    if (error) {
      this.logger.error(`Error validating user jwt: ${error}`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
