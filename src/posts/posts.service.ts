import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post/post.schema';
import { Comment } from '../schemas/comment/comment.schema';
import { Reaction } from '../schemas/reaction.schema';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private readonly usersService: UsersService,
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

  async getPosts(page: number = 1, limit: number = 10) {
    const pularDocumentos = (page - 1) * limit;

    return this.postModel.find()
      .sort({ trendingScore: -1 }) // Ordena do maior score para o menor
      .skip(pularDocumentos)       // Pula os posts das páginas anteriores
      .limit(limit);               // Pega apenas a quantidade solicitada
  }

  @Cron('*/5 * * * * *')
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
        
        // A CORREÇÃO ESTÁ AQUI: Puxando o caminho certo 'stats.likes'
        const likes = post.stats?.likes || 0; 
        
        // Atualiza a nota (que agora existe no Schema) e salva
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
      this.commentModel.deleteMany({ postId: id }),
      this.reactionModel.deleteMany({ postId: id }),
      // TODO: add reports.deleteMany({ postId: id }) when reports module is ready
    ]);
  }

  async updateStats(postId: string, type: 'like' | 'dislike' | 'comment' | 'report', increment: number) {
    const fieldMap = { like: 'stats.likes', dislike: 'stats.dislikes', comment: 'stats.comments', report: 'stats.reports' };
    const result = await this.postModel.updateOne({ _id: postId }, { $inc: { [fieldMap[type]]: increment } });
    if (result.matchedCount === 0) throw new NotFoundException(`Post with id ${postId} not found`);
  }
}
