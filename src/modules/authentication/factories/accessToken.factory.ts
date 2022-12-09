import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../../../shared/entities/user.entity';

@Injectable()
export default class AccessTokenFactory {
  public constructor(private jwtService: JwtService) {}

  public async create(user: UserEntity) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
