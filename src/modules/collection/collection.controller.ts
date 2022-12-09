import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../packages/jwtAuth.guard';
import CollectionService from './collection.service';
import CollectionRepository from '../../shared/repositories/collection.repository';
import CollectionResourceBuilder from '../../shared/resources/collectionResource.builder';
import CreateDto from './dtos/create.dto';
import UpdateDto from './dtos/update.dto';
import AddElementDto from './dtos/addElement.dto';
import CollectionElementResourceBuilder from '../../shared/resources/collectionElementResource.builder';
import CollectionElementRepository from '../../shared/repositories/collectionElement.repository';
import { CollectionRelations } from '../../shared/entities/collection.entity';
import { CollectionElementRelations } from '../../shared/entities/collectionElement.entity';
import { JwtOptionalAuthGuard } from '../../packages/jwtOptionalAuth.guard';

@Controller()
export default class CollectionController {
  constructor(
    private collectionRepository: CollectionRepository,
    private collectionElementRepository: CollectionElementRepository,
    private collectionService: CollectionService,
    private collectionResourceBuilder: CollectionResourceBuilder,
    private collectionElementResourceBuilder: CollectionElementResourceBuilder,
  ) {}

  @Get('/api/collections')
  @UseGuards(JwtOptionalAuthGuard)
  public async search(@Req() request) {
    const user = request.user;
    const page = request?.query?.page || 1;
    const pageSize = request?.query?.pageSize || 10;

    const collections = await this.collectionRepository.findCollections(
      (page - 1) * pageSize,
      pageSize,
      user,
    );

    const builder = this.collectionResourceBuilder
      .id()
      .title()
      .description()
      .isPrivate()
      .isOwned(user)
      .elements(0, 1)
      .createdAt()
      .updatedAt();

    return collections.map((collection) => builder.build(collection));
  }

  @Put('/api/collections/')
  @UseGuards(JwtAuthGuard)
  public async create(@Req() request, @Body() createDto: CreateDto) {
    const collection = await this.collectionService.create(
      request.user,
      createDto,
    );
    return this.collectionResourceBuilder
      .id()
      .title()
      .description()
      .isPrivate()
      .createdAt()
      .updatedAt()
      .build(collection);
  }

  @Get('/api/collections/:id')
  @UseGuards(JwtOptionalAuthGuard)
  public async view(@Req() request, @Param('id') id: string) {
    const user = request.user;
    const collection = await this.collectionRepository.findByIdAndUser(
      id,
      user,
      [CollectionRelations.elements, CollectionRelations.user],
    );
    if (!collection) {
      throw new NotFoundException();
    }
    const page = request?.query?.page || 1;
    const pageSize = request?.query?.pageSize || 10;

    return this.collectionResourceBuilder
      .id()
      .title()
      .description()
      .isPrivate()
      .isOwned(user)
      .createdAt()
      .updatedAt()
      .elements((page - 1) * pageSize, pageSize)
      .build(collection);
  }

  @Patch('/api/collections/:id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ) {
    const collection = await this.collectionRepository.findById(id, [
      CollectionRelations.user,
    ]);
    if (!collection) {
      throw new NotFoundException();
    }
    await this.collectionService.update(request.user, collection, updateDto);
    return this.collectionResourceBuilder
      .id()
      .title()
      .description()
      .isPrivate()
      .createdAt()
      .updatedAt()
      .build(collection);
  }

  @Delete('/api/collections/:id')
  @UseGuards(JwtAuthGuard)
  public async delete(@Req() request, @Param('id') id: string) {
    const collection = await this.collectionRepository.findById(id, [
      CollectionRelations.user,
    ]);
    if (!collection) {
      throw new NotFoundException();
    }
    await this.collectionService.delete(request.user, collection);
    return this.collectionResourceBuilder
      .id()
      .title()
      .description()
      .isPrivate()
      .createdAt()
      .updatedAt()
      .build(collection);
  }

  @Put('/api/collections/:id/elements')
  @UseGuards(JwtAuthGuard)
  public async addItem(
    @Req() request,
    @Param('id') id: string,
    @Body() addElementDto: AddElementDto,
  ) {
    const collection = await this.collectionRepository.findById(id, [
      CollectionRelations.user,
    ]);
    if (!collection) {
      throw new NotFoundException();
    }
    const collectionElement = await this.collectionService.addElement(
      request.user,
      collection,
      addElementDto,
    );
    return this.collectionElementResourceBuilder
      .id()
      .value()
      .createdAt()
      .build(collectionElement);
  }

  @Delete('/api/collections/elements/:id')
  @UseGuards(JwtAuthGuard)
  public async removeElement(@Req() request, @Param('id') id: string) {
    const collectionElement = await this.collectionElementRepository.findById(
      id,
      [
        CollectionElementRelations.collection,
        CollectionElementRelations.collectionUser,
      ],
    );
    if (!collectionElement) {
      throw new NotFoundException();
    }
    await this.collectionService.removeElement(request.user, collectionElement);
    return this.collectionElementResourceBuilder
      .id()
      .value()
      .createdAt()
      .build(collectionElement);
  }
}
