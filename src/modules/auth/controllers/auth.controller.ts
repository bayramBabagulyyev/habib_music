import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SkipAuth } from '../decorators';
import { LoginDto, RegisterDto } from '../dtos/auth-credentials-request.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { RefreshTokenDto } from '../dtos/validate-token-request.dto';
import { AuthService, TokenService } from '../services';

@SkipAuth()
@ApiTags('auth')
@Controller({
  path: 'auth'
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) { }

  @ApiOperation({ description: 'User authentication' })
  @ApiOkResponse({ description: 'Successfully authenticated user' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @SkipAuth()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ description: 'User registration' })
  @ApiOkResponse({ description: 'Successfully registered user' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @SkipAuth()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }


  @ApiOperation({ description: 'Admin login authentication' })
  @SkipAuth()
  @Post('admin-login')
  adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }


  @ApiOperation({ description: 'Renew access in the application' })
  @ApiOkResponse({ description: 'token successfully renewed' })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @SkipAuth()
  @Post('/token/refresh')
  async getNewToken(@Body() body: RefreshTokenDto) {
    return await this.tokenService.generateRefreshToken(body);
  }


  @SkipAuth()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }
}
