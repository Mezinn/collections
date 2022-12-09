import { Body, Controller, Post } from '@nestjs/common';
import RegisterDto from './dtos/register.dto';
import LoginDto from './dtos/login.dto';
import ForgotPasswordDto from './dtos/forgotPassword.dto';
import ResetPasswordDto from './dtos/resetPassword.dto';
import RefreshTokensDto from './dtos/refreshTokens.dto';
import SendEmailConfirmationDto from './dtos/sendEmailConfirmation.dto';
import ConfirmEmailDto from './dtos/confirmEmail.dto';
import AuthenticationService from './authentication.service';
import UserResourceBuilder from '../../shared/resources/userResource.builder';

@Controller()
export default class AuthenticationController {
  public constructor(
    private authenticationService: AuthenticationService,
    private userResourceBuilder: UserResourceBuilder,
  ) {}

  @Post('/api/register')
  public async register(@Body() registerDto: RegisterDto) {
    const user = await this.authenticationService.register(registerDto);
    return this.userResourceBuilder
      .id()
      .email()
      .username()
      .createdAt()
      .build(user);
  }

  @Post('/api/login')
  public async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post('/api/forgotPassword')
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authenticationService.forgotPassword(forgotPasswordDto);
  }

  @Post('/api/resetPassword')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authenticationService.resetPassword(resetPasswordDto);
  }

  @Post('/api/refreshTokens')
  public async refreshTokens(@Body() refreshTokens: RefreshTokensDto) {
    return this.authenticationService.refreshTokens(refreshTokens);
  }

  @Post('/api/sendEmailConfirmation')
  public async sendEmailConfirmation(
    @Body() sendEmailConfirmationDto: SendEmailConfirmationDto,
  ) {
    await this.authenticationService.sendEmailConfirmation(
      sendEmailConfirmationDto,
    );
  }

  @Post('/api/confirmEmail')
  public async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const user = await this.authenticationService.confirmEmail(confirmEmailDto);
    if (user) {
      return this.userResourceBuilder
        .id()
        .email()
        .username()
        .isConfirmed()
        .createdAt()
        .updatedAt()
        .build(user);
    }
  }
}
