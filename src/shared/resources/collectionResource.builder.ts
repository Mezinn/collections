import CollectionEntity from '../entities/collection.entity';
import UserEntity from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class CollectionResourceBuilder {
  private getters: { (collection: CollectionEntity): any }[] = [];

  public id() {
    this.getters.push((collection: CollectionEntity) => ['id', collection.id]);
    return this;
  }

  public title() {
    this.getters.push((collection: CollectionEntity) => [
      'title',
      collection.title,
    ]);
    return this;
  }

  public description() {
    this.getters.push((collection: CollectionEntity) => [
      'description',
      collection.description,
    ]);
    return this;
  }

  public isPrivate() {
    this.getters.push((collection: CollectionEntity) => [
      'isPrivate',
      collection.isPrivate,
    ]);
    return this;
  }

  public isOwned(user?: UserEntity) {
    this.getters.push((collection: CollectionEntity) => [
      'isOwned',
      collection?.user?.id === user?.id,
    ]);

    return this;
  }

  public createdAt() {
    this.getters.push((collection: CollectionEntity) => [
      'createdAt',
      collection.createdAt,
    ]);
    return this;
  }

  public updatedAt() {
    this.getters.push((collection: CollectionEntity) => [
      'updatedAt',
      collection.updatedAt,
    ]);
    return this;
  }

  public elements(offset: number, limit: number) {
    this.getters.push((collection: CollectionEntity) => [
      'elements',
      collection?.elements?.slice(offset, offset + limit) || [],
    ]);
    return this;
  }

  public build(collection: CollectionEntity) {
    return this.getters
      .map((getter) => getter(collection))
      .reduce((object, [key, value]) => {
        object[key] = value;
        return object;
      }, {});
  }
}
