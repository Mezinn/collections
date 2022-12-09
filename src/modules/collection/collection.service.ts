import { Injectable } from '@nestjs/common';
import CreateDto from './dtos/create.dto';
import UserEntity from '../../shared/entities/user.entity';
import UpdateDto from './dtos/update.dto';
import AddElementDto from './dtos/addElement.dto';
import CollectionRepository from '../../shared/repositories/collection.repository';
import CollectionElementRepository from '../../shared/repositories/collectionElement.repository';
import CollectionPolicy from './collection.policy';
import CreateValidator from './validators/create.validator';
import UpdateValidator from './validators/update.validator';
import AddElementValidator from './validators/addElement.validator';
import CollectionEntity from '../../shared/entities/collection.entity';
import CollectionElementEntity from '../../shared/entities/collectionElement.entity';

@Injectable()
export default class CollectionService {
  public constructor(
    private collectionRepository: CollectionRepository,
    private collectionElementRepository: CollectionElementRepository,
    private collectionPolicy: CollectionPolicy,
    private createValidator: CreateValidator,
    private updateValidator: UpdateValidator,
    private addElementValidator: AddElementValidator,
  ) {}

  public async create(user: UserEntity, createDto: CreateDto) {
    await this.collectionPolicy.canCreate(user);
    await this.createValidator.validate(user, createDto);
    const collection = new CollectionEntity();
    collection.user = user;
    collection.title = createDto.title;
    collection.description = createDto.description;
    collection.isPrivate = createDto.isPrivate;
    await this.collectionRepository.save(collection);
    return collection;
  }

  public async update(
    user: UserEntity,
    collection: CollectionEntity,
    updateDto: UpdateDto,
  ) {
    await this.collectionPolicy.canUpdate(user, collection);
    await this.updateValidator.validate(user, collection, updateDto);
    if (updateDto.title) {
      collection.title = updateDto.title;
    }
    if (updateDto.description) {
      collection.description = updateDto.description;
    }
    if (typeof updateDto.isPrivate !== 'undefined') {
      collection.isPrivate = updateDto.isPrivate;
    }
    await this.collectionRepository.save(collection);
    return collection;
  }

  public async delete(user: UserEntity, collection: CollectionEntity) {
    await this.collectionPolicy.canDelete(user, collection);
    await this.collectionRepository.remove(collection);
    return collection;
  }

  public async addElement(
    user: UserEntity,
    collection: CollectionEntity,
    addElementDto: AddElementDto,
  ) {
    await this.collectionPolicy.canAddElement(user, collection);
    await this.addElementValidator.validate(collection, addElementDto);
    const collectionElement = new CollectionElementEntity();
    collectionElement.value = addElementDto.value;
    collectionElement.collection = collection;
    await this.collectionElementRepository.save(collectionElement);
    return collectionElement;
  }

  public async removeElement(
    user: UserEntity,
    collectionElement: CollectionElementEntity,
  ) {
    await this.collectionPolicy.canRemoveElement(user, collectionElement);
    await this.collectionElementRepository.remove(collectionElement);
    return collectionElement;
  }
}
