import { EntityRepository, Repository } from 'typeorm';
import CollectionEntity, {
  CollectionRelations,
} from '../entities/collection.entity';
import UserEntity from '../entities/user.entity';
import { TitleType } from '../types/collection/title.type';

@EntityRepository(CollectionEntity)
export default class CollectionRepository extends Repository<CollectionEntity> {
  public async findByUserAndTitle(
    user: UserEntity,
    title: TitleType,
    relations: CollectionRelations[] = [],
  ) {
    return this.findOne({ where: { user, title }, relations });
  }

  public async findCollections(
    offset: number,
    limit: number,
    user?: UserEntity,
  ) {
    const qb = this.createQueryBuilder('collection');

    qb.innerJoinAndSelect('collection.user', 'user').leftJoinAndSelect(
      'collection.elements',
      'element',
    );

    if (user) {
      qb.addSelect(`(user.id = '${user.id}') as isOwn`);
      qb.where('(user.id = :id or collection.isPrivate = :isPrivate)', {
        id: user.id,
        isPrivate: false,
      });
      qb.orderBy(`isOwn`, 'DESC');
    } else {
      qb.where('(collection.isPrivate = :isPrivate)', {
        isPrivate: false,
      });
    }

    qb.addOrderBy('collection.isPrivate', 'DESC')
      .addOrderBy('collection.title', 'ASC')
      .offset(offset)
      .limit(limit);

    return qb.getMany();
  }

  public async findById(id: string, relations: CollectionRelations[] = []) {
    return this.findOne({ where: { id }, relations });
  }

  public async findByIdAndUser(
    id: string,
    user?: UserEntity,
    relations: CollectionRelations[] = [],
  ) {
    if (user) {
      return this.findOne({ where: { id, user }, relations });
    }
    return this.findOne({ where: { id, isPrivate: false }, relations });
  }

  public async findCollectionsByWorkIds(
    ids: string[],
    offset: number,
    limit: number,
    user?: UserEntity,
  ) {
    return (await this.prepareCollectionsByWorkIds(ids, user))
      .take(limit)
      .skip(offset)
      .getMany();
  }

  public async countCollectionsByWorkIds(ids: string[], user?: UserEntity) {
    return (await this.prepareCollectionsByWorkIds(ids, user)).getCount();
  }

  private async prepareCollectionsByWorkIds(ids: string[], user?: UserEntity) {
    const qb = this.createQueryBuilder('collection');

    qb.distinct()
      .innerJoinAndSelect('collection.elements', 'element')
      .innerJoin('collection.user', 'user')
      .where('element.value in (:...ids)', { ids })
      .groupBy('collection.id, element.id')
      .orderBy('collection.id');
    if (user) {
      qb.andWhere('(user.id = :id or collection.isPrivate = :isPrivate)', {
        id: user.id,
        isPrivate: false,
      });
    } else {
      qb.andWhere('(collection.isPrivate = :isPrivate)', {
        isPrivate: false,
      });
    }
    return qb;
  }
}
