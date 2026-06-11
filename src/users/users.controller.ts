import { Controller, Get, Post, Patch, Put, Delete, Param, Body, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('users') // isso cuida de todas as rotas relacionadas a usuários, como /users, /users/:id, etc.
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post() // POST /users - para criar um novo usuário
    create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        console.log(createUserDto)
        return this.usersService.create(createUserDto);
    }

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUsersById(id: string) {
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
