import { EntityRepository, Repository } from 'typeorm';
import ResetPasswordTokenEntity, {
  ResetPasswordTokenRelations,
} from '../entities/resetPasswordToken.entity';
import UserEntity from '../entities/user.entity';

@EntityRepository(ResetPasswordTokenEntity)
export default class ResetPasswordTokenRepository extends Repository<ResetPasswordTokenEntity> {
  public async findByValue(
    value: string,
    relations: ResetPasswordTokenRelations[] = [],
  ) {
    return this.findOne({ where: { value }, relations });
  }

  public async removeByUser(user: UserEntity) {
    const tokens = await this.find({ where: { user } });
    return this.remove(tokens);
  }
}
