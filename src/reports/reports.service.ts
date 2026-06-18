import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report } from '../schemas/report.schema';
import { PostsService } from 'src/posts/posts.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    private readonly postsService: PostsService,
  ) {}

  async create(postId: string, userId: string, dto: CreateReportDto) {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id');

    const post = await this.postsService.getPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    // TODO: add unique index { postId, userId } to block duplicate reports if needed
    await Promise.all([
      this.reportModel.create({ postId, userId, ...dto }),
      this.postsService.updateStats(postId, 'report', 1),
    ]);
  }
}
