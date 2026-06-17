import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard)
  completeProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: CompleteProfileDto,
  ) {
    return this.usersService.completeProfile(user.sub, dto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUsersById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new NotFoundException(`User with id ${id} not found`);
    const findUser = await this.usersService.getUsersById(id);
    if (!findUser) throw new NotFoundException(`User with id ${id} not found`);
    return findUser;
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) throw new NotFoundException(`User with id ${id} not found`);
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) throw new NotFoundException(`User with id ${id} not found`);
    return;
  }
}
