import { Body, Controller, Delete, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('posts/:postId/comments')
export class CommentsController {

  constructor(private readonly commentsService: CommentsService) {}

  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Post()
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  async create(@Param('postId') postId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(postId, dto, user.sub);
  }

  @Get()
  async findAll(@Param('postId') postId: string, @Query() query: PaginationDto) {
    return this.commentsService.findByPost(postId, query.page, query.limit);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.commentsService.delete(id, user.sub);
  }
}
