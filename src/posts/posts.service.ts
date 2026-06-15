import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = new this.postModel({
         ...createPostDto,
         user: {
            id: '685000000000000000000000',
            nickname: 'marlonribas',
            country: 'Brasil'
        }
    });
    return newPost.save();
  }

  async getPosts() {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async getPostById(id: string) {
    return this.postModel.findById(id);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true });
  }

  async deletePost(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}
