import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileCompleteGuard } from 'src/auth/guards/profile-complete.guard';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('posts/:postId/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  // TODO: replace with Option B — include myReaction inside the post response using an optional JWT guard.
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyReaction(
    @Param('postId') postId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.reactionsService.getMyReaction(postId, user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  async react(@Param('postId') postId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateReactionDto) {
    return this.reactionsService.react(postId, user.sub, dto.type);
  }
}
