import ForgotPasswordDto from '../dtos/forgotPassword.dto';
import { Injectable } from '@nestjs/common';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import MustBeEmail from '../../../packages/validation/predicates/mustBeEmail';
import ContextService from '../../../packages/validation/context.service';
import Required from '../../../packages/validation/predicates/required';

@Injectable()
export default class ForgotPasswordValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private mustBeEmail: MustBeEmail,
    private contextService: ContextService,
  ) {}

  public async validate(forgotPasswordDto: ForgotPasswordDto) {
    const context = await this.contextService.create(forgotPasswordDto);
    await this.required.validate(context.email, forgotPasswordDto.email);
    await this.cannotBeEmpty.validate(context.email, forgotPasswordDto.email);
    await this.mustBeEmail.validate(context.email, forgotPasswordDto.email);
    await this.contextService.validate(context);
  }
}
