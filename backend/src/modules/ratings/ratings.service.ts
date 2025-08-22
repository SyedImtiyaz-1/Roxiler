import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateRatingDto, UpdateRatingDto } from '../../common/dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    // Check if store exists
    const store = await this.prisma.store.findUnique({
      where: { id: createRatingDto.storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: createRatingDto.storeId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException('User has already rated this store');
    }

    const rating = await this.prisma.rating.create({
      data: {
        ratingValue: createRatingDto.ratingValue,
        userId,
        storeId: createRatingDto.storeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return rating;
  }

  async findAll() {
    const ratings = await this.prisma.rating.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }

  async findOne(id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    return rating;
  }

  async findByUser(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }

  async findByStore(storeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }

  async update(id: string, userId: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    // Check if user owns this rating
    if (rating.userId !== userId) {
      throw new NotFoundException('You can only update your own ratings');
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id },
      data: {
        ratingValue: updateRatingDto.ratingValue,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return updatedRating;
  }

  async remove(id: string, userId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    // Check if user owns this rating
    if (rating.userId !== userId) {
      throw new NotFoundException('You can only delete your own ratings');
    }

    await this.prisma.rating.delete({
      where: { id },
    });

    return { message: 'Rating deleted successfully' };
  }

  async getUserRatingForStore(userId: string, storeId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    return rating;
  }
} 