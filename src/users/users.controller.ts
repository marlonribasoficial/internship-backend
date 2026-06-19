import { Controller, Get, Patch, Delete, Param, Body, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto'
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { sub: string }) {
    const foundUser = await this.usersService.findById(user.sub);
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  @Patch('me/complete-profile')
  @UseGuards(JwtAuthGuard)
  async completeProfile(@CurrentUser() user: { sub: string }, @Body() dto: CompleteProfileDto) {
    return this.usersService.completeProfile(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query() query: PaginationDto) {
    return this.usersService.getUsers(query.page, query.limit);
  }

  @Get(':id')
  async getUsersById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new NotFoundException(`User with id ${id} not found`);
    const findUser = await this.usersService.getUsersById(id);
    if (!findUser) throw new NotFoundException(`User with id ${id} not found`);
    return findUser;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  async updateUser(@CurrentUser() user: { sub: string }, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(user.sub, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: { sub: string }) {
    const deletedUser = await this.usersService.deleteUser(user.sub);
    if (!deletedUser) throw new NotFoundException(`User not found`);
    return;
  }
}
