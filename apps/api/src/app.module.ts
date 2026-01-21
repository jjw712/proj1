import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { PostsModule } from './posts/posts.module';

@Module({
  controllers: [AppController],
  providers: [PrismaService],
  imports: [PostsModule],
})
export class AppModule {}

