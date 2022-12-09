import ChangePasswordDto from '../dtos/changePassword.dto';
import { Injectable } from '@nestjs/common';
import UserEntity from '../../../shared/entities/user.entity';
import PasswordHasher from '../../../packages/passwordHasher';
import Required from '../../../packages/validation/predicates/required';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import MustBeEqual from '../../../packages/validation/predicates/mustBeEqual';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import ContextService from '../../../packages/validation/context.service';

@Injectable()
export default class ChangePasswordValidator {
  constructor(
    private passwordHasher: PasswordHasher,
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeEqual: MustBeEqual,
    private contextService: ContextService,
  ) {}

  public async validate(
    user: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ) {
    const context = await this.contextService.create(changePasswordDto);

    await this.required.validate(
      context.oldPassword,
      changePasswordDto.oldPassword,
    );
    await this.cannotBeEmpty.validate(
      context.oldPassword,
      changePasswordDto.oldPassword,
    );
    const isEquals = await this.passwordHasher.isEqual(
      changePasswordDto.oldPassword,
      user.passwordHash,
    );
    if (!isEquals) {
      context.oldPassword.push('Incorrect value');
    }

    await this.required.validate(context.password, changePasswordDto.password);
    await this.cannotBeEmpty.validate(
      context.password,
      changePasswordDto.password,
    );
    await this.lengthCannotBeLessThan.validate(
      context.password,
      changePasswordDto.password,
      6,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.password,
      changePasswordDto.password,
      64,
    );

    await this.required.validate(
      context.confirmPassword,
      changePasswordDto.confirmPassword,
    );
    await this.cannotBeEmpty.validate(
      context.confirmPassword,
      changePasswordDto.confirmPassword,
    );
    await this.lengthCannotBeLessThan.validate(
      context.confirmPassword,
      changePasswordDto.confirmPassword,
      6,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.confirmPassword,
      changePasswordDto.confirmPassword,
      64,
    );

    await this.mustBeEqual.validate(
      context.confirmPassword,
      changePasswordDto.password,
      changePasswordDto.confirmPassword,
      'Password and confirm password values must be equals',
    );

    await this.contextService.validate(context);
  }
}
