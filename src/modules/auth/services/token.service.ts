import { responseMessage } from '@common/http/custom.response';
import { IEnvironment } from '@common/interfaces';
import { UserModel } from '@db/models';
import { UsersService } from '@modules/users/services/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenDto } from '../dtos';
import { RefreshTokenDto } from '../dtos/validate-token-request.dto';
import { TokenError, TokenType } from '../enums';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) { }

  /**
   * Generate Auth token(JWT) service for login user
   * @returns TokenDto Returns access and refresh tokens with expiry
   * @param payload
   */
  public async generateAuthToken(payload: JwtPayload): Promise<TokenDto> {
    const accessTokenExpires = this.configService.get<
      IEnvironment['ACCESS_TOKEN_EXPIRES_IN']
    >('ACCESS_TOKEN_EXPIRES_IN');
    if (!accessTokenExpires) {
      throw new Error('ACCESS_TOKEN_EXPIRES_IN is not defined in environment');
    }

    const refreshTokenExpires = this.configService.get<
      IEnvironment['REFRESH_TOKEN_EXPIRES_IN']
    >('REFRESH_TOKEN_EXPIRES_IN');
    if (!refreshTokenExpires) {
      throw new Error('REFRESH_TOKEN_EXPIRES_IN is not defined in environment');
    }

    const accessTokenSecret = this.configService.get<
      IEnvironment['ACCESS_TOKEN_SECRET']
    >('ACCESS_TOKEN_SECRET');
    if (!accessTokenSecret) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined in environment');
    }

    const refreshTokenSecret = this.configService.get<
      IEnvironment['REFRESH_TOKEN_SECRET']
    >('REFRESH_TOKEN_SECRET');
    if (!refreshTokenSecret) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined in environment');
    }

    const tokenType =
      this.configService.get<IEnvironment['TOKEN_TYPE']>('TOKEN_TYPE') ?? 'Bearer';

    const accessToken = await this.generateToken(
      payload,
      accessTokenExpires,
      accessTokenSecret,
    );

    const refreshToken = await this.generateToken(
      payload,
      refreshTokenExpires,
      refreshTokenSecret,
    );

    return {
      tokenType,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayload}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public async generateRefreshToken({ refreshToken }: RefreshTokenDto) {
    const verified = this.verifyToken(refreshToken, TokenType.RefreshToken);
    const user: UserModel = await this.userService.getUserByUsername(
      verified.email,
    );

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      type: verified.type,
      isSuper: user.isSuper,
    };
    const authTokens: TokenDto = await this.generateAuthToken(payload);
    authTokens.isSuperUser = user.isSuper;

    return responseMessage({ action: 'success', data: authTokens });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string, type: TokenType): JwtPayload {
    try {
      const refreshTokenSecret = this.configService.get<
        IEnvironment['REFRESH_TOKEN_SECRET']
      >('REFRESH_TOKEN_SECRET');

      const accessTokenSecret = this.configService.get<
        IEnvironment['ACCESS_TOKEN_SECRET']
      >('ACCESS_TOKEN_SECRET');

      return this.jwtService.verify(token, {
        secret:
          type === TokenType.AccessToken
            ? accessTokenSecret
            : refreshTokenSecret,
      });
    } catch (err) {
      if (
        err.name == TokenError.TokenExpiredError &&
        type == TokenType.AccessToken
      ) {
        throw new UnauthorizedException();
      }
      if (
        err.name == TokenError.TokenExpiredError &&
        type == TokenType.RefreshToken
      ) {
        throw new UnauthorizedException();
      }
      throw new UnauthorizedException();
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @param expiresIn {string}
   * @param secret
   * @returns JWT
   */

  private async generateToken(
    payload: JwtPayload,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    });
  }
}
