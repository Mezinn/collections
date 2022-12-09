import ConfirmEmailDto from '../dtos/confirmEmail.dto';
import { Injectable } from '@nestjs/common';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import ContextService from '../../../packages/validation/context.service';
import Required from '../../../packages/validation/predicates/required';

@Injectable()
export default class ConfirmEmailValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private contextService: ContextService,
  ) {}

  public async validate(confirmEmailDto: ConfirmEmailDto) {
    const context = await this.contextService.create(confirmEmailDto);
    await this.required.validate(context.token, confirmEmailDto.token);
    await this.cannotBeEmpty.validate(context.token, confirmEmailDto.token);
    await this.contextService.validate(context);
  }
}
