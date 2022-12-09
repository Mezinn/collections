import { ForbiddenException, Injectable } from '@nestjs/common';
import UserEntity from '../../shared/entities/user.entity';
import CollectionEntity from '../../shared/entities/collection.entity';
import CollectionElementEntity from '../../shared/entities/collectionElement.entity';

@Injectable()
export default class CollectionPolicy {
  public async canCreate(user: UserEntity) {
    return true;
  }

  public async canView(user: UserEntity, collection: CollectionEntity) {
    if (collection.user.id !== user.id) {
      throw new ForbiddenException();
    }
  }

  public async canUpdate(user: UserEntity, collection: CollectionEntity) {
    if (collection.user.id !== user.id) {
      throw new ForbiddenException();
    }
  }

  public async canDelete(user: UserEntity, collection: CollectionEntity) {
    if (collection.user.id !== user.id) {
      throw new ForbiddenException();
    }
  }

  public async canAddElement(user: UserEntity, collection: CollectionEntity) {
    if (collection.user.id !== user.id) {
      throw new ForbiddenException();
    }
  }

  public async canRemoveElement(
    user: UserEntity,
    collectionItem: CollectionElementEntity,
  ) {
    if (collectionItem.collection.user.id !== user.id) {
      throw new ForbiddenException();
    }
  }
}
