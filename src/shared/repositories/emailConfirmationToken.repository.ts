import { EntityRepository, Repository } from 'typeorm';
import EmailConfirmationTokenEntity, {
  EmailConfirmationTokenRelations,
} from '../entities/emailConfirmationToken.entity';
import UserEntity from '../entities/user.entity';

@EntityRepository(EmailConfirmationTokenEntity)
export default class EmailConfirmationTokenRepository extends Repository<EmailConfirmationTokenEntity> {
  public async findByValue(
    value: string,
    relations: EmailConfirmationTokenRelations[] = [],
  ) {
    return this.findOne({ where: { value }, relations });
  }

  public async removeByUser(user: UserEntity) {
    const tokens = await this.find({ where: { user } });
    return this.remove(tokens);
  }
}
