import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ContextPrototypeProxy } from './contextPrototypeProxy';

const handler = {
  get: function (target, name) {
    if (!target[name]) {
      target[name] = [];
    }
    return target[name];
  },
};

@Injectable()
export default class ContextService {
  public async create<T>(contextPrototype: T) {
    return new ContextPrototypeProxy<
      object,
      { [Properties in keyof typeof contextPrototype]: string[] }
    >({}, handler);
  }

  public async validate(context: object) {
    const errors = {};

    for (const key in context) {
      const propertyErrors = context[key];
      if (propertyErrors.length) {
        errors[key] = propertyErrors.slice(0, 1).pop();
      }
    }
    if (Object.keys(errors).length) {
      throw new UnprocessableEntityException({ errors });
    }
  }
}
