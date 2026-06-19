import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('posts/:postId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post()
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  async create(@Param('postId') postId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateReportDto) {
    return this.reportsService.create(postId, user.sub, dto);
  }
}
