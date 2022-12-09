import UserEntity from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserResourceBuilder {
  private getters: { (user: UserEntity): any }[] = [];

  public id() {
    this.getters.push((user: UserEntity) => ['id', user.id]);
    return this;
  }

  public email() {
    this.getters.push((user: UserEntity) => ['email', user.email]);
    return this;
  }

  public username() {
    this.getters.push((user: UserEntity) => ['username', user.username]);
    return this;
  }

  public firstName() {
    this.getters.push((user: UserEntity) => ['firstName', user.firstName]);
    return this;
  }

  public lastName() {
    this.getters.push((user: UserEntity) => ['lastName', user.lastName]);
    return this;
  }

  public isConfirmed() {
    this.getters.push((user: UserEntity) => ['isConfirmed', user.isConfirmed]);
    return this;
  }

  public createdAt() {
    this.getters.push((user: UserEntity) => ['createdAt', user.createdAt]);
    return this;
  }

  public updatedAt() {
    this.getters.push((user: UserEntity) => ['updatedAt', user.updatedAt]);
    return this;
  }

  public build(user: UserEntity) {
    return this.getters
      .map((getter) => getter(user))
      .reduce((object, [key, value]) => {
        object[key] = value;
        return object;
      }, {});
  }
}
