import { EntityRepository, Repository } from 'typeorm';
import UserEntity, { UserRelations } from '../entities/user.entity';
import { EmailType } from '../types/user/email.type';
import { UsernameType } from '../types/user/username.type';

@EntityRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {
  public async findByEmail(email: EmailType, relations: UserRelations[] = []) {
    return this.findOne({ where: { email }, relations });
  }

  public async findByUsername(
    username: UsernameType,
    relations: UserRelations[] = [],
  ) {
    return this.findOne({ where: { username }, relations });
  }
}
