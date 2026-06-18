import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../schemas/comment/comment.schema';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UsersModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
