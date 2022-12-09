import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IdType } from '../types/collection/id.type';
import { TitleType } from '../types/collection/title.type';
import { DescriptionType } from '../types/collection/description.type';
import { IsPrivateType } from '../types/collection/isPrivate.type';
import UserEntity from './user.entity';
import CollectionElementEntity from './collectionElement.entity';

export enum CollectionRelations {
  user = 'user',
  elements = 'elements',
}

@Entity({ name: 'collections' })
@Unique(['user', 'title'])
export default class CollectionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: IdType;
  @Column({ name: 'title', length: 32 })
  public title: TitleType;
  @Column({ name: 'description', length: 512, nullable: true })
  public description: DescriptionType | null;
  @Column({ name: 'is_private', default: false })
  public isPrivate: IsPrivateType;
  @CreateDateColumn({ name: 'created_at' })
  public updatedAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  public createdAt: Date;
  @ManyToOne(() => UserEntity, (user) => user.collections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;
  @OneToMany(() => CollectionElementEntity, (element) => element.collection)
  public elements: CollectionElementEntity[];
}
