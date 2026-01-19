import 'dotenv/config';
import { Injectable } from '@nestjs/common';

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

@Injectable()
export class PrismaService {
  public readonly client;

  constructor() {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) throw new Error('DATABASE_URL is missing. Check apps/api/.env');

    const adapter = new PrismaPg({ connectionString: url });
    this.client = new PrismaClient({ adapter });
  }
}
