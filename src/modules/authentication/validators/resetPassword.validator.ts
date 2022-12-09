import { Injectable } from '@nestjs/common';
import Required from '../../../packages/validation/predicates/required';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeEqual from '../../../packages/validation/predicates/mustBeEqual';
import ContextService from '../../../packages/validation/context.service';
import ResetPasswordDto from '../dtos/resetPassword.dto';

@Injectable()
export default class ResetPasswordValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeEqual: MustBeEqual,
    private contextService: ContextService,
  ) {}

  public async validate(resetPasswordDto: ResetPasswordDto) {
    const context = await this.contextService.create(resetPasswordDto);
    await this.required.validate(context.token, resetPasswordDto.token);
    await this.cannotBeEmpty.validate(context.token, resetPasswordDto.token);

    await this.required.validate(context.password, resetPasswordDto.password);
    await this.cannotBeEmpty.validate(
      context.password,
      resetPasswordDto.password,
    );
    await this.lengthCannotBeLessThan.validate(
      context.password,
      resetPasswordDto.password,
      6,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.password,
      resetPasswordDto.password,
      64,
    );

    await this.required.validate(
      context.confirmPassword,
      resetPasswordDto.confirmPassword,
    );
    await this.cannotBeEmpty.validate(
      context.confirmPassword,
      resetPasswordDto.confirmPassword,
    );
    await this.lengthCannotBeLessThan.validate(
      context.confirmPassword,
      resetPasswordDto.confirmPassword,
      6,
    );
    await this.lengthCannotBeGreaterThan.validate(
      context.confirmPassword,
      resetPasswordDto.confirmPassword,
      64,
    );
    await this.mustBeEqual.validate(
      context.confirmPassword,
      resetPasswordDto.password,
      resetPasswordDto.confirmPassword,
      'Confirm password and password must be the same',
    );
  }
}
