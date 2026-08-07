import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOrganizationReviewDto,
  CreateProductReviewDto,
} from './dto/create-review.dto';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/files/files.service';
import { UploadedReviewFilesDto } from './dto/upload-review-files.dto';
import { PopularityService } from 'src/popularity/popularity.service';
import { ReviewQuerryDTO } from './dto/pagination-querry-dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly FileService: FileService,
    private readonly PopularityService: PopularityService,
  ) {}

  async findAll(dto: ReviewQuerryDTO) {
    const {type, page, limit, search, order, sortBy} = dto
     const skip = (page - 1) * limit;
    const where: any = {};
  
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { review: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type === 'product') {
      where.organization =  false
    } else if (type === 'organization') {
      where.organization = true
    }

    const reviews = await this.prisma.review.findMany({
      where,
      skip,
      take:limit,
      orderBy: {
        [sortBy]: order,
      },
    })

    const total = await this.prisma.review.count({ where });

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    }
  }

  async findReviewsByProductId(id: string) {
    const [reviews, stats, ratingDistribution] = await Promise.all([
    this.prisma.review.findMany({
      where: { productId: id },
      orderBy: { created_at: 'desc' }
    }),
    this.prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { id: true }
    }),
    this.getRatingDistributionWithPercentages(id)
  ]);

  if (!reviews || reviews.length === 0) {
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: await this.getRatingDistributionWithPercentages(id),
    };
  }

    return {
      reviews,
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id,
      ratingDistribution
    };
  }

  async findAllByType(param: 'organization' | 'product') {
    const candidate = await this.prisma.review.findMany({
      where: {
        organization: param === "organization" ? true : false
      }
    })
    return candidate
  }

  async createProductReview(
    dto: CreateProductReviewDto,
    files: UploadedReviewFilesDto,
  ) {
    const { username, rating, email, review, productId } = dto;

    const candidate = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!candidate) {
      throw new NotFoundException(
        'Продукта с таким индетификатором не существует',
      );
    }

    const paths = await this.FileService.saveFiles(files, 'review');

    const rev = await this.prisma.review.create({
      data: {
        username,
        rating: +rating,
        email,
        review,
        productId,
        avatar: paths.avatarPath as string,
        imgs: paths.imagesPaths as string[],
      },
      include: {
        product: true,
      },
    });

    await this.PopularityService.handleReview(productId, rating);
    console.log(rev)

    return rev;
  }

  async createOrganizationReview(dto: CreateOrganizationReviewDto) {
    const { username, rating, email, review } = dto;

    return await this.prisma.review.create({
      data: {
        username,
        rating,
        email,
        review,
        organization: true,
      },
    });
  }

  async remove(id: string) {
    const candidate = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!candidate) {
      throw new NotFoundException(
        'Отзыва с таким идентификатором не существует',
      );
    }

    if (candidate.avatar) {
      await this.FileService.deleteFile(candidate.avatar, 'review');
    }

    if (candidate.imgs && candidate.imgs.length > 0) {
      await Promise.all(
        candidate.imgs.map((img) => this.FileService.deleteFile(img, 'review')),
      );
    }

    return await this.prisma.review.delete({
      where: {
        id,
      },
    });
  }

  private async getRatingDistributionWithPercentages(productId: string) {
  const distribution = await this.prisma.review.groupBy({
    by: ['rating'],
    where: { productId },
    _count: { id: true }
  });

  const totalReviews = await this.prisma.review.count({
    where: { productId }
  });

  if (totalReviews === 0) {
    return this.createEmptyRatingDistribution();
  }

  const fullDistribution = {};
  for (let rating = 1; rating <= 5; rating++) {
    const ratingData = distribution.find(item => item.rating === rating);
    const count = ratingData ? ratingData._count.id : 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    fullDistribution[rating] = {
      count,
      percentage: Math.round(percentage * 10) / 10 
    };
  }

  return fullDistribution;
}

private createEmptyRatingDistribution() {
  const distribution = {};
  for (let rating = 1; rating <= 5; rating++) {
    distribution[rating] = {
      count: 0,
      percentage: 0
    };
  }
  return distribution;
}
}
