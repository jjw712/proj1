import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  list(take: number, cursor?: number) {
    return this.prisma.client.post.findMany({
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: 'desc' },
    });
  }

  async get(id: number) {
    const post = await this.prisma.client.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('post not found');
    return post;
  }

  create(dto: CreatePostDto) {
    return this.prisma.client.post.create({
      data: { title: dto.title, content: dto.content },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.get(id); // 없으면 404
    return this.prisma.client.post.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.get(id); // 없으면 404
    await this.prisma.client.post.delete({ where: { id } });
    return { ok: true };
  }
}
