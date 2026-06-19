import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reaction, Type as ReactionType } from '../schemas/reaction.schema';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private readonly postsService: PostsService,
  ) {}

  // TODO: migrate to Option B — include myReaction in the post response via an optional JWT guard.
  // Option B eliminates this extra round-trip but requires forwardRef between PostsModule and ReactionsModule.
  async getMyReaction(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id');
    const reaction = await this.reactionModel.findOne({ postId, userId });
    return { type: reaction?.type ?? null };
  }

  async react(postId: string, userId: string, type: ReactionType) {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id');

    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.reactionModel.findOne({ postId, userId });

    if (existing) {
      if (existing.type === type) {
        // Mesmo tipo → remove a reação (toggle off)
        await Promise.all([
          this.reactionModel.findByIdAndDelete(existing._id),
          this.postsService.updateStats(postId, type, -1),
        ]);
        return { action: 'removed', type };
      }

      // Tipo diferente → troca like↔dislike
      const oldType = existing.type;
      existing.type = type;
      await Promise.all([
        existing.save(),
        this.postsService.updateStats(postId, oldType, -1),
        this.postsService.updateStats(postId, type, 1),
      ]);
      return { action: 'switched', from: oldType, to: type };
    }

    // Sem reação anterior → cria nova
    await Promise.all([
      this.reactionModel.create({ postId, userId, type }),
      this.postsService.updateStats(postId, type, 1),
    ]);
    return { action: 'added', type };
  }
}
