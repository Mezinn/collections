import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdType } from '../types/user/id.type';
import { EmailType } from '../types/user/email.type';
import { UsernameType } from '../types/user/username.type';
import { FirstNameType } from '../types/user/firstName.type';
import { LastNameType } from '../types/user/lastName.type';
import { IsConfirmedType } from '../types/user/isConfirmed.type';
import { PasswordHashType } from '../types/user/passwordHash.type';
import CollectionEntity from './collection.entity';
import RefreshTokenEntity from './refreshToken.entity';
import ResetPasswordTokenEntity from './resetPasswordToken.entity';
import EmailConfirmationTokenEntity from './emailConfirmationToken.entity';
import { PassphraseType } from '../types/user/passphrase.type';

export enum UserRelations {
  refreshTokens = 'refreshTokens',
  resetPasswordToken = 'resetPasswordToken',
  emailConfirmationToken = 'emailConfirmationToken',
  collections = 'collections',
}

@Entity()
export default class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: IdType;
  @Column({ name: 'email', length: 64, unique: true })
  public email: EmailType;
  @Column({ name: 'username', length: 32, unique: true })
  public username: UsernameType;
  @Column({ name: 'first_name', length: 32, nullable: true })
  public firstName: FirstNameType | null;
  @Column({ name: 'last_name', length: 32, nullable: true })
  public lastName: LastNameType | null;
  @Column({ name: 'password_hash', length: 64 })
  public passwordHash: PasswordHashType;
  @Column({ name: 'passphrase', length: 32, unique: true })
  public passphrase: PassphraseType;
  @Column({ name: 'is_confirmed', default: false })
  public isConfirmed: IsConfirmedType;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  public refreshTokens: RefreshTokenEntity[];
  @OneToOne(
    () => ResetPasswordTokenEntity,
    (resetPasswordToken) => resetPasswordToken.user,
  )
  public resetPasswordToken: ResetPasswordTokenEntity;
  @OneToOne(
    () => EmailConfirmationTokenEntity,
    (emailConfirmationToken) => emailConfirmationToken.user,
  )
  public emailConfirmationToken: EmailConfirmationTokenEntity;
  @OneToMany(() => CollectionEntity, (collection) => collection.user)
  public collections: CollectionEntity[];
}
