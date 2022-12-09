import RegisterDto from './dtos/register.dto';
import LoginDto from './dtos/login.dto';
import ForgotPasswordDto from './dtos/forgotPassword.dto';
import ResetPasswordDto from './dtos/resetPassword.dto';
import RefreshTokensDto from './dtos/refreshTokens.dto';
import SendEmailConfirmationDto from './dtos/sendEmailConfirmation.dto';
import ConfirmEmailDto from './dtos/confirmEmail.dto';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import RegisterValidator from './validators/register.validator';
import LoginValidator from './validators/login.validator';
import ForgotPasswordValidator from './validators/forgotPassword.validator';
import ResetPasswordValidator from './validators/resetPassword.validator';
import RefreshTokensValidator from './validators/refreshTokens.validator';
import SendEmailConfirmationValidator from './validators/sendEmailConfirmation.validator';
import ConfirmEmailValidator from './validators/confirmEmail.validator';
import UserRepository from '../../shared/repositories/user.repository';
import PasswordHasher from '../../packages/passwordHasher';
import UserEntity from '../../shared/entities/user.entity';
import PassphraseFactory from './factories/passphrase.factory';
import EmailConfirmationTokenFactory from './factories/emailConfirmationToken.factory';
import ConfirmEmailMail from './mails/confirmEmail.mail';
import AccessTokenFactory from './factories/accessToken.factory';
import RefreshTokenFactory from './factories/refreshToken.factory';
import ResetPasswordTokenRepository from '../../shared/repositories/resetPasswordToken.repository';
import ResetPasswordMail from './mails/resetPassword.mail';
import { ResetPasswordTokenRelations } from '../../shared/entities/resetPasswordToken.entity';
import RefreshTokenRepository from '../../shared/repositories/refreshToken.repository';
import { RefreshTokenRelations } from '../../shared/entities/refreshToken.entity';
import EmailConfirmationTokenRepository from '../../shared/repositories/emailConfirmationToken.repository';
import { EmailConfirmationTokenRelations } from '../../shared/entities/emailConfirmationToken.entity';
import { AsIsConfirmedType } from '../../shared/types/user/isConfirmed.type';
import ResetPasswordTokenFactory from './factories/resetPasswordToken.factory';

@Injectable()
export default class AuthenticationService {
  public constructor(
    private userRepository: UserRepository,
    private resetPasswordTokenRepository: ResetPasswordTokenRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private emailConfirmationTokenRepository: EmailConfirmationTokenRepository,
    private registerValidator: RegisterValidator,
    private loginValidator: LoginValidator,
    private forgotPasswordValidator: ForgotPasswordValidator,
    private resetPasswordValidator: ResetPasswordValidator,
    private refreshTokensValidator: RefreshTokensValidator,
    private sendEmailConfirmationValidator: SendEmailConfirmationValidator,
    private confirmEmailValidator: ConfirmEmailValidator,
    private passwordHasher: PasswordHasher,
    private passphraseFactory: PassphraseFactory,
    private emailConfirmationTokenFactory: EmailConfirmationTokenFactory,
    private accessTokenFactory: AccessTokenFactory,
    private refreshTokenFactory: RefreshTokenFactory,
    private resetPasswordTokenFactory: ResetPasswordTokenFactory,
    private confirmEmailMail: ConfirmEmailMail,
    private resetPasswordMail: ResetPasswordMail,
  ) {}

  public async register(registerDto: RegisterDto) {
    await this.registerValidator.validate(registerDto);
    const user = new UserEntity();
    user.email = registerDto.email;
    user.username = registerDto.username;
    user.passwordHash = await this.passwordHasher.hash(registerDto.password);
    user.passphrase = this.passphraseFactory.create();
    await this.userRepository.save(user);
    const emailConfirmationToken =
      await this.emailConfirmationTokenFactory.create(user);
    await this.confirmEmailMail.send(user, emailConfirmationToken);

    return user;
  }

  public async login(loginDto: LoginDto) {
    await this.loginValidator.validate(loginDto);
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (user) {
      const isEquals = await this.passwordHasher.isEqual(
        loginDto.password,
        user.passwordHash,
      );
      if (isEquals) {
        return {
          accessToken: await this.accessTokenFactory.create(user),
          refreshToken: (await this.refreshTokenFactory.create(user)).value,
        };
      }
    }
    throw new UnprocessableEntityException({
      errors: { message: 'Wrong email or password' },
    });
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    await this.forgotPasswordValidator.validate(forgotPasswordDto);
    const user = await this.userRepository.findByEmail(forgotPasswordDto.email);
    if (user) {
      await this.resetPasswordTokenRepository.removeByUser(user);
      const resetPasswordToken = await this.resetPasswordTokenFactory.create(
        user,
      );
      await this.resetPasswordTokenRepository.save(resetPasswordToken);
      this.resetPasswordMail.send(user, resetPasswordToken);
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await this.resetPasswordValidator.validate(resetPasswordDto);
    const resetPasswordToken =
      await this.resetPasswordTokenRepository.findByValue(
        resetPasswordDto.token,
        [ResetPasswordTokenRelations.user],
      );
    if (resetPasswordToken && !resetPasswordToken.isExpires) {
      const user = resetPasswordToken.user;
      user.passwordHash = await this.passwordHasher.hash(
        resetPasswordDto.password,
      );
      await this.userRepository.save(user);
    }
  }

  public async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    const refreshToken = await this.refreshTokenRepository.findByValue(
      refreshTokensDto.refreshToken,
      [RefreshTokenRelations.user],
    );
    await this.refreshTokenRepository.remove(refreshToken);
    if (refreshToken && !refreshToken.isExpires) {
      const user = refreshToken.user;
      return {
        accessToken: await this.accessTokenFactory.create(user),
        refreshToken: (await this.refreshTokenFactory.create(user)).value,
      };
    }
  }

  public async sendEmailConfirmation(
    sendEmailConfirmationDto: SendEmailConfirmationDto,
  ) {
    const user = await this.userRepository.findByEmail(
      sendEmailConfirmationDto.email,
    );
    if (user) {
      await this.emailConfirmationTokenRepository.removeByUser(user);
      const emailConfirmationToken =
        await this.emailConfirmationTokenFactory.create(user);
      await this.confirmEmailMail.send(user, emailConfirmationToken);
    }
  }

  public async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    const emailConfirmationToken =
      await this.emailConfirmationTokenRepository.findByValue(
        confirmEmailDto.token,
        [EmailConfirmationTokenRelations.user],
      );
    if (emailConfirmationToken && !emailConfirmationToken.isExpires) {
      const user = emailConfirmationToken.user;
      await this.emailConfirmationTokenRepository.removeByUser(user);
      user.isConfirmed = AsIsConfirmedType(true);
      await this.userRepository.save(user);
      return user;
    }
  }
}
