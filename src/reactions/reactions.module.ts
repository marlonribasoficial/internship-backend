import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from '../schemas/reaction.schema';
import { PostsModule } from '../posts/posts.module';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
