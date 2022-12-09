import { Injectable } from '@nestjs/common';
import Required from '../../../packages/validation/predicates/required';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import ContextService from '../../../packages/validation/context.service';
import RefreshTokensDto from '../dtos/refreshTokens.dto';

@Injectable()
export default class RefreshTokensValidator {
  public constructor(
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private contextService: ContextService,
  ) {}

  public async validate(refreshTokensDto: RefreshTokensDto) {
    const context = await this.contextService.create(refreshTokensDto);
    await this.required.validate(
      context.refreshToken,
      refreshTokensDto.refreshToken,
    );
    await this.cannotBeEmpty.validate(
      context.refreshToken,
      refreshTokensDto.refreshToken,
    );
    await this.contextService.validate(context);
  }
}
