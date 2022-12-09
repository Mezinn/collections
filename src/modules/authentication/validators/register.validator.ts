import { Injectable } from '@nestjs/common';
import RegisterDto from '../dtos/register.dto';
import Required from '../../../packages/validation/predicates/required';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeEqual from '../../../packages/validation/predicates/mustBeEqual';
import MustBeEmail from '../../../packages/validation/predicates/mustBeEmail';
import MustBeUnique from '../../../packages/validation/predicates/mustBeUnique';
import ContextService from '../../../packages/validation/context.service';
import UserRepository from '../../../shared/repositories/user.repository';

@Injectable()
export default class RegisterValidator {
  public constructor(
    private userRepository: UserRepository,
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeEmail: MustBeEmail,
    private mustBeEqual: MustBeEqual,
    private mustBeUnique: MustBeUnique,
    private contextService: ContextService,
  ) {}

  public async validate(registerDto: RegisterDto) {
    const context = await this.contextService.create(registerDto);
    await this.required.validate(context.email, registerDto.email);
    await this.cannotBeEmpty.validate(context.email, registerDto.email);
    await this.lengthCannotBeLessThan.validate(
      context.email,
      registerDto.email,
      2,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.email,
      registerDto.email,
      128,
    );
    await this.mustBeEmail.validate(context.email, registerDto.email);
    await this.mustBeUnique.validate(
      context.email,
      async () => !(await this.userRepository.findByEmail(registerDto.email)),
    );
    await this.required.validate(context.username, registerDto.username);
    await this.cannotBeEmpty.validate(context.username, registerDto.username);
    await this.lengthCannotBeLessThan.validate(
      context.username,
      registerDto.username,
      2,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.username,
      registerDto.username,
      64,
    );
    await this.mustBeUnique.validate(
      context.username,
      async () =>
        !(await this.userRepository.findByUsername(registerDto.username)),
    );
    await this.required.validate(context.password, registerDto.password);
    await this.cannotBeEmpty.validate(context.password, registerDto.password);
    await this.lengthCannotBeLessThan.validate(
      context.password,
      registerDto.password,
      8,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.password,
      registerDto.password,
      64,
    );
    await this.required.validate(
      context.confirmPassword,
      registerDto.confirmPassword,
    );
    await this.cannotBeEmpty.validate(
      context.confirmPassword,
      registerDto.confirmPassword,
    );
    await this.lengthCannotBeLessThan.validate(
      context.confirmPassword,
      registerDto.confirmPassword,
      8,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.confirmPassword,
      registerDto.confirmPassword,
      64,
    );
    await this.mustBeEqual.validate(
      context.confirmPassword,
      registerDto.password,
      registerDto.confirmPassword,
      'Confirm password and password must be the same',
    );
    await this.contextService.validate(context);
  }
}
