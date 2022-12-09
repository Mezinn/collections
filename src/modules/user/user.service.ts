import UpdateDto from './dtos/update.dto';
import ChangePasswordDto from './dtos/changePassword.dto';
import UserEntity from '../../shared/entities/user.entity';
import { Injectable } from '@nestjs/common';
import UpdateValidator from './validators/update.validator';
import ChangePasswordValidator from './validators/changePassword.validator';
import UserRepository from '../../shared/repositories/user.repository';
import PasswordHasher from '../../packages/passwordHasher';

@Injectable()
export default class UserService {
  public constructor(
    private userRepository: UserRepository,
    private updateValidator: UpdateValidator,
    private changePasswordValidator: ChangePasswordValidator,
    private passwordHasher: PasswordHasher,
  ) {}

  public async update(user: UserEntity, updateDto: UpdateDto) {
    await this.updateValidator.validate(updateDto);
    if (updateDto.firstName) {
      user.firstName = updateDto.firstName;
    }
    if (updateDto.lastName) {
      user.lastName = updateDto.lastName;
    }
    if (updateDto.username) {
      user.username = updateDto.username;
    }
    await this.userRepository.save(user);
    return user;
  }

  public async changePassword(
    user: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ) {
    await this.changePasswordValidator.validate(user, changePasswordDto);
    user.passwordHash = await this.passwordHasher.hash(
      changePasswordDto.password,
    );
    await this.userRepository.save(user);

    return user;
  }
}
