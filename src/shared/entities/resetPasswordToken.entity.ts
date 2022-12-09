import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IdType } from '../types/resetPasswordToken/id.type';
import { ValueType } from '../types/resetPasswordToken/value.type';
import UserEntity from './user.entity';

export enum ResetPasswordTokenRelations {
  user = 'user',
}

@Entity({ name: 'reset_password_tokens' })
export default class ResetPasswordTokenEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: IdType;
  @Column({ name: 'value', length: 32, unique: true })
  public value: ValueType;
  @Column({ name: 'expires_at' })
  public expiresAt: Date;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  @OneToOne(() => UserEntity, (user) => user.resetPasswordToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  public get isExpires(): boolean {
    return this.expiresAt <= new Date();
  }
}
