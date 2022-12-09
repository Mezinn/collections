import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IdType } from '../types/refreshToken/id.type';
import { ValueType } from '../types/refreshToken/value.type';
import UserEntity from './user.entity';

export enum RefreshTokenRelations {
  user = 'user',
}

@Entity({ name: 'refresh_tokens' })
export default class RefreshTokenEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: IdType;
  @Column({ name: 'value', length: 32, unique: true })
  public value: ValueType;
  @Column({ name: 'expires_at' })
  public expiresAt: Date;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  public get isExpires(): boolean {
    return this.expiresAt <= new Date();
  }
}
