import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    create(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    // private users = [
    //     {
    //         "id": 1,
    //         "name": "Marlon Ribas",
    //         "email": "marlon.ribas@example.com",
    //         "role": "tourist"
    //     },
    //     {
    //         "id": 2,
    //         "name": "Karla Sofia",
    //         "email": "karla.sofia@example.com",
    //         "role": "tourist"
    //     },
    //     {
    //         "id": 3,
    //         "name": "Sonia Costa",
    //         "email": "sonia.costa@example.com",
    //         "role": "local"
    //     },
    //     {
    //         "id": 4,
    //         "name": "Karla Sofia",
    //         "email": "karla.sofia@example.com",
    //         "role": "tourist"
    //     },
    //     {
    //         "id": 5,
    //         "name": "Carlos Silva",
    //         "email": "carlos.silva@example.com",
    //         "role": "local"
    //     }
    // ];

    // findAll(role?: 'tourist' | 'local') {
    //     if (role) {
    //         const rolesArray = this.users.filter(user => user.role === role);
    //         if (!rolesArray.length) throw new NotFoundException(`No users with role ${role} found`);
    //         return rolesArray;
    //     }
    //     return this.users;
    // }

    // findOne(id: number) {
    //     const user = this.users.find(user => user.id === id);
    //     if (!user) throw new NotFoundException(`User with id ${id} not found`);
    //     return user;
    // }

    // create(createUserDto: CreateUserDto) {
    //     const newUser = {
    //         id: this.users.length + 1,
    //         ...createUserDto
    //     };
    //     this.users.push(newUser);
    //     return newUser;
    // }

    // updatePartial(id: number, updateUserDto: UpdateUserDto) {
    //     const user = this.findOne(id);
    //     const updatedUser = { ...user, ...updateUserDto };
    //     const index = this.users.findIndex(user => user.id === id);
    //     this.users[index] = updatedUser;
    //     return updatedUser;
    // }

    // remove(id: number) {
    //     const index = this.users.findIndex(user => user.id === id);
    //     if (index === -1) throw new NotFoundException(`User with id ${id} not found`);
    //     const removedUser = this.users.splice(index, 1);
    //     return removedUser[0];
    // }
}
