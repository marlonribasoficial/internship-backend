import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Post } from '../schemas/post/post.schema';

@Injectable()
export class TrendingService {
  private readonly logger = new Logger(TrendingService.name);

  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  @Cron('*/5 * * * * *')
  async recalcularScores() {
    this.logger.log('Iniciando recálculo de trending scores...');

    const posts = await this.postModel.find({}, { _id: 1, 'stats.likes': 1, createdAt: 1 }).lean();

    const gravity = 1.8;
    const agora = Date.now();

    const ops = posts.map((post) => {
      const dataCriacao = post.createdAt ? new Date(post.createdAt).getTime() : agora;
      const idadeEmHoras = Math.max(0, (agora - dataCriacao) / (1000 * 60 * 60));
      const likes = post.stats?.likes ?? 0;
      const score = likes / Math.pow(idadeEmHoras + 2, gravity);

      return {
        updateOne: {
          filter: { _id: post._id },
          update: { $set: { trendingScore: score } },
        },
      };
    });

    if (ops.length > 0) {
      await this.postModel.bulkWrite(ops, { ordered: false });
    }

    this.logger.log(`${ops.length} scores atualizados`);
  }
}
