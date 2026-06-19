import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import mongoose from 'mongoose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {}

    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @Post()
    @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
    async create(@CurrentUser() user: { sub: string }, @Body() createPostDto: CreatePostDto) {
        return await this.postsService.create(createPostDto, user.sub);
    }

    @Get()
    async getPosts(@Query() query: PaginationDto) {
        return await this.postsService.getPosts(query.page, query.limit);
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
