import UpdateDto from '../dtos/update.dto';
import { Injectable } from '@nestjs/common';
import CollectionRepository from '../../../shared/repositories/collection.repository';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import Required from '../../../packages/validation/predicates/required';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeUnique from '../../../packages/validation/predicates/mustBeUnique';
import ContextService from '../../../packages/validation/context.service';
import UserEntity from '../../../shared/entities/user.entity';
import CollectionEntity from '../../../shared/entities/collection.entity';

@Injectable()
export default class UpdateValidator {
  constructor(
    private collectionRepository: CollectionRepository,
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeUnique: MustBeUnique,
    private contextService: ContextService,
  ) {}

  public async validate(
    user: UserEntity,
    collection: CollectionEntity,
    updateDto: UpdateDto,
  ) {
    const context = await this.contextService.create(updateDto);

    if (updateDto.title) {
      await this.required.validate(context.title, updateDto.title);
      await this.cannotBeEmpty.validate(context.title, updateDto.title);
      await this.lengthCannotBeGreaterThan.validate(
        context.title,
        updateDto.title,
        64,
      );
      await this.lengthCannotBeLessThan.validate(
        context.title,
        updateDto.title,
        2,
      );
      const existing = await this.collectionRepository.findByUserAndTitle(
        user,
        updateDto.title,
      );
      await this.mustBeUnique.validate(
        context.title,
        async () => !existing || existing.id === collection.id,
      );
    }
    if (updateDto.description) {
      await this.required.validate(context.description, updateDto.description);
      await this.cannotBeEmpty.validate(
        context.description,
        updateDto.description,
      );
      await this.lengthCannotBeGreaterThan.validate(
        context.description,
        updateDto.description,
        512,
      );
      await this.lengthCannotBeLessThan.validate(
        context.description,
        updateDto.description,
        2,
      );
    }
    await this.contextService.validate(context);
  }
}
