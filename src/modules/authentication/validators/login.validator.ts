import LoginDto from '../dtos/login.dto';
import { Injectable } from '@nestjs/common';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import MustBeEmail from '../../../packages/validation/predicates/mustBeEmail';
import ContextService from '../../../packages/validation/context.service';
import Required from '../../../packages/validation/predicates/required';

@Injectable()
export default class LoginValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private mustBeEmail: MustBeEmail,
    private contextService: ContextService,
  ) {}

  public async validate(loginDto: LoginDto) {
    const context = await this.contextService.create(loginDto);
    await this.required.validate(context.email, loginDto.email);
    await this.cannotBeEmpty.validate(context.email, loginDto.email);
    await this.mustBeEmail.validate(context.email, loginDto.email);
    await this.required.validate(context.password, loginDto.password);
    await this.cannotBeEmpty.validate(context.password, loginDto.password);
    await this.contextService.validate(context);
  }
}
