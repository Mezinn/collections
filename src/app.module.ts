import { Module } from '@nestjs/common';
import AuthenticationController from './modules/authentication/authentication.controller';
import AuthenticationService from './modules/authentication/authentication.service';
import Required from './packages/validation/predicates/required';
import CannotBeEmpty from './packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from './packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from './packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeEqual from './packages/validation/predicates/mustBeEqual';
import MustBeUnique from './packages/validation/predicates/mustBeUnique';
import PasswordHasher from './packages/passwordHasher';
import ConfirmEmailMail from './modules/authentication/mails/confirmEmail.mail';
import ResetPasswordMail from './modules/authentication/mails/resetPassword.mail';
import ContextService from './packages/validation/context.service';
import AccessTokenFactory from './modules/authentication/factories/accessToken.factory';
import RefreshTokenFactory from './modules/authentication/factories/refreshToken.factory';
import ValueFactory from './modules/authentication/factories/value.factory';
import PassphraseFactory from './modules/authentication/factories/passphrase.factory';
import ResetPasswordTokenFactory from './modules/authentication/factories/resetPasswordToken.factory';
import EmailConfirmationTokenFactory from './modules/authentication/factories/emailConfirmationToken.factory';
import UserResourceBuilder from './shared/resources/userResource.builder';
import CollectionResourceBuilder from './shared/resources/collectionResource.builder';
import RegisterValidator from './modules/authentication/validators/register.validator';
import LoginValidator from './modules/authentication/validators/login.validator';
import ForgotPasswordValidator from './modules/authentication/validators/forgotPassword.validator';
import ResetPasswordValidator from './modules/authentication/validators/resetPassword.validator';
import RefreshTokensValidator from './modules/authentication/validators/refreshTokens.validator';
import SendEmailConfirmationValidator from './modules/authentication/validators/sendEmailConfirmation.validator';
import ConfirmEmailValidator from './modules/authentication/validators/confirmEmail.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserRepository from './shared/repositories/user.repository';
import RefreshTokenRepository from './shared/repositories/refreshToken.repository';
import ResetPasswordTokenRepository from './shared/repositories/resetPasswordToken.repository';
import EmailConfirmationTokenRepository from './shared/repositories/emailConfirmationToken.repository';
import CollectionRepository from './shared/repositories/collection.repository';
import CollectionElementRepository from './shared/repositories/collectionElement.repository';
import UserEntity from './shared/entities/user.entity';
import ResetPasswordTokenEntity from './shared/entities/resetPasswordToken.entity';
import RefreshTokenEntity from './shared/entities/refreshToken.entity';
import EmailConfirmationTokenEntity from './shared/entities/emailConfirmationToken.entity';
import CollectionElementEntity from './shared/entities/collectionElement.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import MustBeEmail from './packages/validation/predicates/mustBeEmail';
import CollectionEntity from './shared/entities/collection.entity';
import { default as UserUpdateValidator } from './modules/user/validators/update.validator';
import { default as CollectionUpdateValidator } from './modules/collection/validators/update.validator';
import ChangePasswordValidator from './modules/user/validators/changePassword.validator';
import UserController from './modules/user/user.controller';
import UserService from './modules/user/user.service';
import { JwtStrategy } from './packages/jwt.strategy';
import CollectionElementResourceBuilder from './shared/resources/collectionElementResource.builder';
import CollectionController from './modules/collection/collection.controller';
import CollectionService from './modules/collection/collection.service';
import CollectionPolicy from './modules/collection/collection.policy';
import CreateValidator from './modules/collection/validators/create.validator';
import AddElementValidator from './modules/collection/validators/addElement.validator';
import SearchController from './modules/search/search.controller';
import SearchService from './modules/search/search.service';
import SearchModel from './modules/search/searchModel';
import SearchRunner from './modules/search/searchRunner';
import WorkProvider from './modules/search/providers/work.provider';
import { Client } from '@opensearch-project/opensearch';
import CollectionProvider from './modules/search/providers/collection.provider';
import ArticleProvider from './modules/search/providers/article.provider';
import SearchResultResourceBuilder from './shared/resources/searchResultResource.builder';
import ProviderBuilder from './modules/search/provider.builder';
import ProviderBuilderFactory from './modules/search/providerBuilder.factory';
import { config } from 'dotenv';

config({ path: __dirname + '/../.env' });

const databaseUrl = process.env.DATABASE_URL;
let postgresConfig = {};

if (databaseUrl) {
  postgresConfig = {
    url: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  postgresConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };
}

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_USER,
      },
      template: {
        dir: __dirname + '/../src/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      RefreshTokenRepository,
      ResetPasswordTokenRepository,
      EmailConfirmationTokenRepository,
      CollectionRepository,
      CollectionElementRepository,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...postgresConfig,
      entities: [
        UserEntity,
        RefreshTokenEntity,
        ResetPasswordTokenEntity,
        EmailConfirmationTokenEntity,
        CollectionEntity,
        CollectionElementEntity,
      ],
      synchronize: true,
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_TTL },
    }),
  ],
  controllers: [
    AuthenticationController,
    CollectionController,
    UserController,
    SearchController,
  ],
  providers: [
    {
      useFactory: () => {
        return new Client({
          node: process.env.OPENSEARCH_HOST,
          auth: {
            username: process.env.OPENSEARCH_USER,
            password: process.env.OPENSEARCH_PASSWORD,
          },
        });
      },
      provide: Client,
    },

    JwtStrategy,

    AuthenticationService,
    CollectionService,
    UserService,
    SearchService,
    SearchModel,
    SearchRunner,
    ProviderBuilder,

    //providers
    WorkProvider,
    CollectionProvider,
    ArticleProvider,

    //validators
    RegisterValidator,
    LoginValidator,
    ForgotPasswordValidator,
    ResetPasswordValidator,
    RefreshTokensValidator,
    SendEmailConfirmationValidator,
    ConfirmEmailValidator,

    UserUpdateValidator,
    ChangePasswordValidator,

    CreateValidator,
    CollectionUpdateValidator,
    AddElementValidator,

    //policies
    CollectionPolicy,

    //resources
    UserResourceBuilder,
    CollectionResourceBuilder,
    CollectionElementResourceBuilder,
    SearchResultResourceBuilder,

    //factories
    ValueFactory,
    AccessTokenFactory,
    RefreshTokenFactory,
    PassphraseFactory,
    ResetPasswordTokenFactory,
    EmailConfirmationTokenFactory,
    ProviderBuilderFactory,

    //mails
    ConfirmEmailMail,
    ResetPasswordMail,

    //packages
    PasswordHasher,

    //predicates
    Required,
    CannotBeEmpty,
    LengthCannotBeLessThan,
    LengthCannotBeGreaterThan,
    MustBeEmail,
    MustBeEqual,
    MustBeUnique,
    ContextService,
  ],
})
export class AppModule {}
