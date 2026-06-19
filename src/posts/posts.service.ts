import { Inject, Injectable, NotFoundException, ForbiddenException, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post/post.schema';

import { UsersService } from '../users/users.service';
import { CommentsService } from '../comments/comments.service';
import { ReactionsService } from '../reactions/reactions.service';
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CommentsService)) private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => ReactionsService)) private readonly reactionsService: ReactionsService,
    @Inject(forwardRef(() => ReportsService)) private readonly reportsService: ReportsService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const newPost = new this.postModel({
        ...createPostDto,
        user: {
            id: user._id,
            nickname: user.nickname,
            photoUrl: user.photoUrl,
            country: user.country,
        }
    });
    return newPost.save();
  }

  async getPosts(page: number, limit: number) {
    return this.postModel.find().sort({ trendingScore: -1 }).skip((page - 1) * limit).limit(limit).lean();
  }

  async getPostById(id: string) {
    return this.postModel.findById(id).lean();
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    if (post.user.id.toString() !== userId) throw new ForbiddenException('You can only edit your own posts');
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true });
  }

  async deletePost(id: string, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    if (post.user.id.toString() !== userId) throw new ForbiddenException('You can only delete your own posts');

    await Promise.all([
      this.postModel.findByIdAndDelete(id),
      this.commentsService.deleteByPostId(id),
      this.reactionsService.deleteByPostId(id),
      this.reportsService.deleteByPostId(id),
    ]);
  }

  async updateStats(postId: string, type: 'like' | 'dislike' | 'comment' | 'report', increment: number) {
    const fieldMap = { like: 'stats.likes', dislike: 'stats.dislikes', comment: 'stats.comments', report: 'stats.reports' };
    const result = await this.postModel.updateOne({ _id: postId }, { $inc: { [fieldMap[type]]: increment } });
    if (result.matchedCount === 0) throw new NotFoundException(`Post with id ${postId} not found`);
  }
}
