import { Injectable } from '@nestjs/common';
import CollectionElementEntity from '../entities/collectionElement.entity';

@Injectable()
export default class CollectionElementResourceBuilder {
  private getters: { (collection: CollectionElementEntity): any }[] = [];

  public id() {
    this.getters.push((element: CollectionElementEntity) => ['id', element.id]);
    return this;
  }

  public value() {
    this.getters.push((element: CollectionElementEntity) => [
      'value',
      element.value,
    ]);
    return this;
  }

  public createdAt() {
    this.getters.push((element: CollectionElementEntity) => [
      'createdAt',
      element.createdAt,
    ]);

    return this;
  }

  public build(collectionElement: CollectionElementEntity) {
    return this.getters
      .map((getter) => getter(collectionElement))
      .reduce((object, [key, value]) => {
        object[key] = value;
        return object;
      }, {});
  }
}
