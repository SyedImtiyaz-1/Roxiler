import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateStoreDto, UpdateStoreDto, StoreQueryDto } from '../../common/dto/store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await this.prisma.store.create({
      data: createStoreDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
      },
    });

    return store;
  }

  async findAll(query: StoreQueryDto) {
    const { name, address, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const stores = await this.prisma.store.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return stores;
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
        ratings: {
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
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async findByOwner(ownerId: string) {
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return stores;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const updatedStore = await this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
      },
    });

    return updatedStore;
  }

  async remove(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    await this.prisma.store.delete({
      where: { id },
    });

    return { message: 'Store deleted successfully' };
  }
} 