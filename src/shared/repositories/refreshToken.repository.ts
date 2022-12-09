import { EntityRepository, Repository } from 'typeorm';
import RefreshTokenEntity, {
  RefreshTokenRelations,
} from '../entities/refreshToken.entity';

@EntityRepository(RefreshTokenEntity)
export default class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  public async findByValue(
    value: string,
    relations: RefreshTokenRelations[] = [],
  ) {
    return this.findOne({ where: { value }, relations });
  }
}
