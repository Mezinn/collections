import { EntityRepository, Repository } from 'typeorm';
import CollectionElementEntity, {
  CollectionElementRelations,
} from '../entities/collectionElement.entity';
import CollectionEntity from '../entities/collection.entity';
import { ValueType } from '../types/collectionElement/value.type';

@EntityRepository(CollectionElementEntity)
export default class CollectionElementRepository extends Repository<CollectionElementEntity> {
  public async findOByCollectionAndValue(
    collection: CollectionEntity,
    value: ValueType,
    relations: CollectionElementRelations[] = [],
  ) {
    return this.findOne({ where: { collection, value }, relations });
  }

  public async findById(id: string, relations: string[] = []) {
    return this.findOne({ where: { id }, relations });
  }
}
