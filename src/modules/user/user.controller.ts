import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import UserService from './user.service';
import { JwtAuthGuard } from '../../packages/jwtAuth.guard';
import UserResourceBuilder from '../../shared/resources/userResource.builder';
import UpdateDto from './dtos/update.dto';
import ChangePasswordDto from './dtos/changePassword.dto';

@Controller()
export default class UserController {
  public constructor(
    private userService: UserService,
    private userResourceBuilder: UserResourceBuilder,
  ) {}

  @Get('/api/me')
  @UseGuards(JwtAuthGuard)
  public async view(@Req() request) {
    const user = request.user;
    return this.userResourceBuilder
      .id()
      .email()
      .username()
      .firstName()
      .lastName()
      .isConfirmed()
      .createdAt()
      .updatedAt()
      .build(user);
  }

  @Patch('/api/me')
  @UseGuards(JwtAuthGuard)
  public async update(@Req() request, @Body() updateDto: UpdateDto) {
    const user = await this.userService.update(request.user, updateDto);
    return this.userResourceBuilder
      .id()
      .username()
      .email()
      .firstName()
      .lastName()
      .isConfirmed()
      .createdAt()
      .updatedAt()
      .build(user);
  }

  @Post('/api/me/changePassword')
  @UseGuards(JwtAuthGuard)
  public async changePassword(
    @Req() request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(request.user, changePasswordDto);
  }
}
