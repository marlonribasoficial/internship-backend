import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Post, PostSchema } from '../posts/schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}