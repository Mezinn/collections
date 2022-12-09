import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IdType } from '../types/collectionElement/id.type';
import { ValueType } from '../types/collectionElement/value.type';
import CollectionEntity from './collection.entity';

export enum CollectionElementRelations {
  collection = 'collection',
  collectionUser = 'collection.user',
}

@Entity({ name: 'collection_elements' })
@Unique(['collection', 'value'])
export default class CollectionElementEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: IdType;
  @Column({ name: 'value', length: 32 })
  public value: ValueType;
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  @ManyToOne(() => CollectionEntity, (collection) => collection.elements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  public collection: CollectionEntity;
}
