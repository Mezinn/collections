import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IdType } from '../types/emailConfirmationToken/id.type';
import { ValueType } from '../types/emailConfirmationToken/value.type';
import UserEntity from './user.entity';

export enum EmailConfirmationTokenRelations {
  user = 'user',
}

@Entity({ name: 'email_confirmation_token' })
export default class EmailConfirmationTokenEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: IdType;
  @Column({ name: 'value', length: 32, unique: true })
  public value: ValueType;
  @Column({ name: 'expires_at' })
  public expiresAt: Date;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  @OneToOne(() => UserEntity, (user) => user.emailConfirmationToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  public get isExpires(): boolean {
    return this.expiresAt <= new Date();
  }
}
