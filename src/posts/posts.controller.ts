import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import mongoose from 'mongoose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
    async create(@CurrentUser() user: { sub: string }, @Body() createPostDto: CreatePostDto) {
        return await this.postsService.create(createPostDto, user.sub);
    }

    @Get()
    async getPosts(
        // Pega os parâmetros da URL, ex: /posts?page=1&limit=10
        @Query('page') page?: string, 
        @Query('limit') limit?: string
    ) {
        // Converte os textos da URL para números, com valores padrão caso venham vazios
        const numeroPagina = page ? parseInt(page, 10) : 1;
        const limitePorPagina = limit ? parseInt(limit, 10) : 10;

        return await this.postsService.getPosts(numeroPagina, limitePorPagina);
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
    @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
    async updatePost(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
        return this.postsService.updatePost(id, updatePostDto, user.sub);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
    async deletePost(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new BadRequestException(`Invalid id: ${id}`);
        await this.postsService.deletePost(id, user.sub);
        return { message: 'Post deleted successfully' };
    }
}
