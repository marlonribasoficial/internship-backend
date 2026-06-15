import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {}

    @Post()
    // Aqui eu colocaria o usuário como parâmetro quando eu tiver a autenticação implementada, por enquanto vou deixar hardcoded no service
    async create(@Body() createPostDto: CreatePostDto) {
        console.log(createPostDto)
        return await this.postsService.create(createPostDto);
    }

    @Get()
    async getPosts() {
        return await this.postsService.getPosts();
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);        
        const findPost = await this.postsService.getPostById(id);
        if (!findPost) throw new NotFoundException(`Post with id ${id} not found`);
        return findPost;   
    }

    @Patch(':id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
        const updatedPost = await this.postsService.updatePost(id, updatePostDto);
        if (!updatedPost) throw new NotFoundException(`Post with id ${id} not found`);
        return updatedPost;
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
        const deletedPost = await this.postsService.deletePost(id);
        if (!deletedPost) throw new NotFoundException(`Post with id ${id} not found`);
        return {
            message: 'Post deleted successfully',
        };
    }
}
