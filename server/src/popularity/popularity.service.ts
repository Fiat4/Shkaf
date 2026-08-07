import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PopularityService {
  private readonly WEIGHTS = {
    RATING: 0.5,
    VIEWS: 0.05,
    ORDERS: 0.4,
    REVIEWS_COUNT: 0.05,
  };

  constructor(private readonly prisma: PrismaService) {}

  async handleView(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 },
      },
    });
    await this.updateTotalScore(id);
  }

  async handleOrder(id: string): Promise<void> {
    await this.updateTotalScore(id);
  }

  async handleReview(id: string, _newRate?: number): Promise<void> {
    const candidate = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!candidate) {
      throw new NotFoundException(
        'Продукт не найден, рассчет рейтинга недоступен.',
      );
    }

    await this.updateTotalScore(candidate.id);
  }

  private calculateRatingScore(rating: number, reviewsCount: number): number {
    const confidence = 1 - Math.exp(-reviewsCount / 10);
    return rating * confidence;
  }

  private normalizeViews(views: number): number {
    return Math.log(views + 1) / Math.log(1000);
  }

  private normalizeOrders(orders: number): number {
    return Math.log(orders + 1) / Math.log(500);
  }

  private normalizeReviewsCount(count: number): number {
    return Math.min(count / 50, 1);
  }

  private async calculateProductScore(productId: string) {
    const candidate = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        orders: true,
        reviews: true,
      },
    });

    if (!candidate) {
      throw new NotFoundException('Продукт не найден');
    }

    const averageRating =
      candidate.reviews.length > 0
        ? candidate.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
          candidate.reviews.length
        : 0;

    const ratingScore = this.calculateRatingScore(
      averageRating,
      candidate.reviews.length,
    );
    const viewsScore = this.normalizeViews(candidate.viewsCount);
    const ordersScore = this.normalizeOrders(candidate.orders.length);
    const reviewsCountScore = this.normalizeReviewsCount(
      candidate.reviews.length,
    );

    return (
      ratingScore * this.WEIGHTS.RATING +
      viewsScore * this.WEIGHTS.VIEWS +
      ordersScore * this.WEIGHTS.ORDERS +
      reviewsCountScore * this.WEIGHTS.REVIEWS_COUNT
    );
  }

  async updateTotalScore(productId: string) {
    const popularityScore = await this.calculateProductScore(productId);

    return await this.prisma.product.update({
      where: { id: productId },
      data: { popularityScore },
    });
  }
}
