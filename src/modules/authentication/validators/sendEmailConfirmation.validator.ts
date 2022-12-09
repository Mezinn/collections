import SendEmailConfirmationDto from '../dtos/sendEmailConfirmation.dto';
import { Injectable } from '@nestjs/common';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import MustBeEmail from '../../../packages/validation/predicates/mustBeEmail';
import ContextService from '../../../packages/validation/context.service';
import Required from '../../../packages/validation/predicates/required';

@Injectable()
export default class SendEmailConfirmationValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private mustBeEmail: MustBeEmail,
    private contextService: ContextService,
  ) {}

  public async validate(sendEmailConfirmationDto: SendEmailConfirmationDto) {
    const context = await this.contextService.create(sendEmailConfirmationDto);
    await this.required.validate(context.email, sendEmailConfirmationDto.email);
    await this.cannotBeEmpty.validate(
      context.email,
      sendEmailConfirmationDto.email,
    );
    await this.mustBeEmail.validate(
      context.email,
      sendEmailConfirmationDto.email,
    );
    await this.contextService.validate(context);
  }
}
