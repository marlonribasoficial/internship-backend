import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TrendingService } from './trending.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post/post.schema';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from 'src/reports/reports.module';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    UsersModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => ReactionsModule),
    forwardRef(() => ReportsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, TrendingService],
  exports: [PostsService],
})
export class PostsModule {}
