import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  UploadedCreateFilesDto,
  UploadedUpdateFilesDto,
} from './dto/uploaded-files.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/files/files.service';
import { QueryProductDto } from './dto/querry-product.dto';
import { ProductCategory } from '@prisma/client';
import { PopularityService } from 'src/popularity/popularity.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly FileService: FileService,
    private readonly PopularityService: PopularityService,
  ) {}

  async create(dto: CreateProductDto, files: UploadedCreateFilesDto) {
    const candidate = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (candidate) {
      throw new BadRequestException('Продукт с таким названием уже существует');
    }

    const paths = await this.FileService.saveFiles(files, 'product');

    return await this.prisma.product.create({
      data: {
        ...dto,
        price: +dto.price,
        avatar: paths.avatarPath as string,
        imgs: paths.imagesPaths as string[],
      },
    });
  }

  async findAll(filters: QueryProductDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minHeight,
      minWidth,
      minDepth,
      maxHeight,
      maxWidth,
      maxDepth,
      sortBy,
      order,
      page,
      limit,
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const normalizedCategory =
      typeof category === 'string' ? category.toUpperCase() : category;
    if (
      normalizedCategory &&
      Object.values(ProductCategory).includes(
        normalizedCategory as ProductCategory,
      )
    ) {
      where.category = normalizedCategory;
    }

    if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
      where.price = { ...where.price, lte: maxPrice };
    }

    if (minHeight !== undefined && minHeight !== null && !isNaN(minHeight)) {
      where.height = { ...where.height, gte: minHeight };
    }

    if (maxHeight !== undefined && maxHeight !== null && !isNaN(maxHeight)) {
      where.height = { ...where.height, lte: maxHeight };
    }

    if (minWidth !== undefined && minWidth !== null && !isNaN(minWidth)) {
      where.width = { ...where.width, gte: minWidth };
    }

    if (maxWidth !== undefined && maxWidth !== null && !isNaN(maxWidth)) {
      where.width = { ...where.width, lte: maxWidth };
    }

    if (minDepth !== undefined && minDepth !== null && !isNaN(minDepth)) {
      where.depth = { ...where.depth, gte: minDepth };
    }

    if (maxDepth !== undefined && maxDepth !== null && !isNaN(maxDepth)) {
      where.depth = { ...where.depth, lte: maxDepth };
    }

    const data = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
    });

    const total = await this.prisma.product.count({ where });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string) {
    const candidate = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!candidate) {
      throw new NotFoundException(
        'Продукта с таким идентификатором не существует',
      );
    }

    await this.PopularityService.handleView(id);

    return candidate;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: UploadedUpdateFilesDto,
  ) {
    const candidate = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (!candidate) {
      throw new BadRequestException(
        'Продукта с таким идентификатором не существует',
      );
    }

    let pathsToUpdate: { avatar?: string; imgs?: string[] } = {};

    if (
      (files.avatar && files.avatar.length > 0) ||
      (files.imgs && files.imgs.length > 0)
    ) {
      const paths = await this.FileService.saveFiles(files, 'product');

      if (paths.avatarPath && candidate.avatar) {
        await this.FileService.deleteFile(candidate.avatar, 'product');
        pathsToUpdate.avatar = paths.avatarPath;
      } else if (paths.avatarPath) {
        pathsToUpdate.avatar = paths.avatarPath;
      }
      if (paths.imagesPaths && paths.imagesPaths.length > 0) {
        if (candidate.imgs && candidate.imgs.length > 0) {
          await Promise.all(
            candidate.imgs.map((img) =>
              this.FileService.deleteFile(img, 'product'),
            ),
          );
        }
        pathsToUpdate.imgs = paths.imagesPaths;
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...updateProductDto,
        ...pathsToUpdate,
      },
    });

    return updatedProduct;
  }

  async delete(id: string) {
    const candidate = await this.prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      throw new BadRequestException(
        'Продукта с таким идентификатором не существует',
      );
    }

    if (candidate.avatar) {
      await this.FileService.deleteFile(candidate.avatar, 'product');
    }
    if (candidate.imgs && candidate.imgs.length > 0) {
      await Promise.all(
        candidate.imgs.map((img) =>
          this.FileService.deleteFile(img, 'product'),
        ),
      );
    }

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
