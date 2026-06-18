import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment/comment.schema';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {

  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(postId: string, dto: CreateCommentDto, userId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id');

    const [user, post] = await Promise.all([
      this.usersService.findById(userId),
      this.postsService.getPostById(postId),
    ]);

    if (!user) throw new NotFoundException('User not found');
    if (!post) throw new NotFoundException('Post not found');

    const newComment = new this.commentModel({
      postId: post._id,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        photoUrl: user.photoUrl,
      },
      ...dto,
    });

    const saved = await newComment.save();
    await this.postsService.updateStats(postId, 'comment', 1);
    return saved;
  }

  async findByPost(postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id');
    return this.commentModel.find({ postId }).sort({ createdAt: 1 });
  }

  async delete(commentId: string, userId: string) {
    if (!Types.ObjectId.isValid(commentId)) throw new BadRequestException('Invalid comment id');

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user.id.toString() !== userId) throw new ForbiddenException('You can only delete your own comments');
    
    await this.postsService.updateStats(comment.postId.toString(), 'comment', -1);
    return this.commentModel.findByIdAndDelete(commentId);
  }
}
