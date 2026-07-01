import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post/post.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

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

  async getPosts(page: number = 1, limit: number = 10) {
    const pularDocumentos = (page - 1) * limit;

    return this.postModel.find()
      .sort({ trendingScore: -1 }) // Ordena do maior score para o menor
      .skip(pularDocumentos)       // Pula os posts das páginas anteriores
      .limit(limit);               // Pega apenas a quantidade solicitada
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async recalcularScoresBackground() {
    console.log('Iniciando o recálculo do algoritmo de Trending...');
    const posts = await this.postModel.find();
    
    const gravity = 1.8;
    const agora = new Date().getTime();

    for (const post of posts) {
        // Pega a data que o Mongoose gerou e calcula a idade em horas
        const dataCriacao = post.createdAt ? post.createdAt.getTime() : agora;
        const idadeEmHoras = (agora - dataCriacao) / (1000 * 60 * 60);
        const safeAge = Math.max(0, idadeEmHoras);
        const likes = post.stats?.likes || 0; 
        const novaNota = likes / Math.pow((safeAge + 2), gravity);
        
        // Atualiza SÓ a nota direto no banco, ignorando se o resto do post está incompleto
        await this.postModel.updateOne(
            { _id: post._id }, 
            { $set: { trendingScore: novaNota } }
        );
    }
    console.log('Todos os scores foram atualizados com sucesso!');
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
