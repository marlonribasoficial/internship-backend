import { Controller, Get, Post, Patch, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // isso cuida de todas as rotas relacionadas a usuários, como /users, /users/:id, etc.
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get() // GET /users - para obter uma lista de usuários
    // É possível usar o @Query() para obter parâmetros de consulta, como ?page=1&limit=10
    findAll(@Query('role') role?: 'tourist' | 'local') {
        // lógica para obter todos os usuários
        return this.usersService.findAll(role);
    }

    @Get(':id') // GET /users/:id - para obter um usuário específico por ID
    findOne(@Param('id', ParseIntPipe) id: number) {
        // lógica para obter um usuário específico por ID
        return this.usersService.findOne(id);
    }

    @Post() // POST /users - para criar um novo usuário
    create(@Body() createUserDto: CreateUserDto) {
        // lógica para criar um novo usuário
        return this.usersService.create(createUserDto);
    }

    @Patch(':id') // PATCH /users/:id - para atualizar parcialmente um usuário existente por ID
    updatePartial(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        // lógica para atualizar parcialmente um usuário existente por ID
        return this.usersService.updatePartial(id, updateUserDto);
    }

    // @Put(':id') // PUT /users/:id - para atualizar um usuário existente por ID
    // update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    //     // lógica para atualizar um usuário existente por ID
    // }

    @Delete(':id') // DELETE /users/:id - para excluir um usuário por ID
    remove(@Param('id', ParseIntPipe) id: number) {
        // lógica para excluir um usuário por ID
        return this.usersService.remove(id);
    }
}
