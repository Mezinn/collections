import CreateDto from '../dtos/create.dto';
import { Injectable } from '@nestjs/common';
import CollectionRepository from '../../../shared/repositories/collection.repository';
import Required from '../../../packages/validation/predicates/required';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeUnique from '../../../packages/validation/predicates/mustBeUnique';
import ContextService from '../../../packages/validation/context.service';
import UserEntity from '../../../shared/entities/user.entity';

@Injectable()
export default class CreateValidator {
  constructor(
    private collectionRepository: CollectionRepository,
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeUnique: MustBeUnique,
    private contextService: ContextService,
  ) {}

  public async validate(user: UserEntity, createDto: CreateDto) {
    const context = await this.contextService.create(createDto);
    await this.required.validate(context.title, createDto.title);
    await this.cannotBeEmpty.validate(context.title, createDto.title);
    await this.lengthCannotBeGreaterThan.validate(
      context.title,
      createDto.title,
      64,
    );
    await this.lengthCannotBeLessThan.validate(
      context.title,
      createDto.title,
      2,
    );
    await this.mustBeUnique.validate(
      context.title,
      async () =>
        !(await this.collectionRepository.findByUserAndTitle(
          user,
          createDto.title,
        )),
    );
    if (createDto.description) {
      await this.cannotBeEmpty.validate(
        context.description,
        createDto.description,
      );
      await this.lengthCannotBeGreaterThan.validate(
        context.description,
        createDto.description,
        512,
      );
      await this.lengthCannotBeLessThan.validate(
        context.description,
        createDto.description,
        2,
      );
    }
    await this.contextService.validate(context);
  }
}
