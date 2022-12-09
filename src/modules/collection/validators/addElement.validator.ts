import AddElementDto from '../dtos/addElement.dto';
import { Injectable } from '@nestjs/common';
import CollectionElementRepository from '../../../shared/repositories/collectionElement.repository';
import CannotBeEmpty from '../../../packages/validation/predicates/cannotBeEmpty';
import LengthCannotBeLessThan from '../../../packages/validation/predicates/lengthCannotBeLessThan';
import LengthCannotBeGreaterThan from '../../../packages/validation/predicates/lengthCannotBeGreaterThan';
import MustBeUnique from '../../../packages/validation/predicates/mustBeUnique';
import ContextService from '../../../packages/validation/context.service';
import CollectionEntity from '../../../shared/entities/collection.entity';
import Required from '../../../packages/validation/predicates/required';

@Injectable()
export default class AddElementValidator {
  constructor(
    private collectionElementRepository: CollectionElementRepository,
    private required: Required,
    private cannotBeEmpty: CannotBeEmpty,
    private lengthCannotBeLessThan: LengthCannotBeLessThan,
    private lengthCannotBeGreaterThan: LengthCannotBeGreaterThan,
    private mustBeUnique: MustBeUnique,
    private contextService: ContextService,
  ) {}

  public async validate(
    collection: CollectionEntity,
    addElementDto: AddElementDto,
  ) {
    const context = await this.contextService.create(addElementDto);

    await this.required.validate(context.value, addElementDto.value);
    await this.cannotBeEmpty.validate(context.value, addElementDto.value);
    await this.lengthCannotBeGreaterThan.validate(
      context.value,
      addElementDto.value,
      64,
    );
    await this.mustBeUnique.validate(
      context.value,
      async () =>
        !(await this.collectionElementRepository.findOByCollectionAndValue(
          collection,
          addElementDto.value,
        )),
    );
    await this.contextService.validate(context);
  }
}
