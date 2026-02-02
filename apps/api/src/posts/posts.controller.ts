import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ToggleReactionDto } from "./dto/toggle-like.dto";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';



@ApiTags('posts')
@Controller('posts') // main.ts에서 /api prefix 있으니 /api/posts
export class PostsController {
  constructor(private readonly posts: PostsService, 
    private readonly postsService: PostsService) {}

  private parseId(id: string): number {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException('id must be a positive integer');
    }
    return n;
  }

  @Get()
  async list(@Query('take') take?: string, @Query('cursor') cursor?: string) {
    const takeNum = Math.min(Math.max(Number(take ?? 20), 1), 50);

    const cursorNum =
      cursor !== undefined && cursor !== '' ? Number(cursor) : undefined;
    if (
      cursorNum !== undefined &&
      (!Number.isInteger(cursorNum) || cursorNum <= 0)
    ) {
      throw new BadRequestException('cursor must be a positive integer');
    }

    const items = await this.posts.list(takeNum, cursorNum);
    const nextCursor = items.length ? items[items.length - 1].id : null;
    return { items, nextCursor };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.posts.get(this.parseId(id));
  }

  @UseGuards(JwtAuthGuard) // 게스트/유저 전부 토큰 필요
@Post()
create(@Req() req, @Body() dto: CreatePostDto) {
  return this.postsService.create(dto, req.user);
}


  @Post(':id/reaction')
toggleReaction(@Param('id') id: string, @Body() dto: ToggleReactionDto) {
  return this.posts.toggleReaction(this.parseId(id), dto);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    if (body.title === undefined && body.content === undefined) {
      throw new BadRequestException('at least one of title/content is required');
    }
    return this.posts.update(this.parseId(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posts.remove(this.parseId(id));
  }
}
