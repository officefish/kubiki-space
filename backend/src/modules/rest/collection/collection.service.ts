import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  // Создание коллекции или возврат существующей
  async createCollection(userId: string) {
    return this.prisma.collection.upsert({
      where: { userId }, // пытаемся найти коллекцию по userId
      update: {}, // если коллекция уже существует, ничего не обновляем
      create: {
        userId, // создаем новую коллекцию для пользователя
      },
    });
  }

  async getCollection(userId: string) {
    return this.prisma.collection.findUnique({
      where: { userId },
      include: { bricks: true, sets: true },
    });
  }
}