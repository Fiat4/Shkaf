import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
import { OrderStatus } from '@prisma/client';
import { QueryOrderDto } from './dto/querry-order.dto';
import { PopularityService } from 'src/popularity/popularity.service';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly PopularityService: PopularityService,
    private readonly telegram: TelegramService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { product, comment, ...orderBaseData } = createOrderDto;

    if (!product) {
      const newOrder = await this.prisma.order.create({
        data: {
          ...orderBaseData,
          ...(comment !== undefined ? { comment } : {}),
        },
        include: { product: true },
      });
      await this.safeNotifyNew(newOrder);
      return newOrder;
    }

    const candidate = await this.prisma.product.findUnique({
      where: { id: product },
    });

    if (!candidate) {
      throw new NotFoundException('Товар с этим идентификатором не найден.');
    }

    const newOrder = await this.prisma.order.create({
      data: {
        ...orderBaseData,
        ...(comment !== undefined ? { comment } : {}),
        product: {
          connect: {
            id: candidate.id,
          },
        },
      },
      include: {
        product: true,
      },
    });

    await this.PopularityService.handleOrder(candidate.id);
    await this.safeNotifyNew(newOrder);
    return newOrder;
  }

  async findAll(dto: QueryOrderDto) {
    const { status, type } = dto;
    const where: any = {};

    if (status && Object.values(OrderStatus).includes(status)) {
      where.status = status;
    }

    if (type && type === 'CONSULTATION') {
      where.product = null;
    } else if (type && type === 'ORDER') {
      where.product = {
        isNot: null,
      };
    }
    return await this.prisma.order.findMany({
      where,
      include: { product: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      throw new NotFoundException(`Заказ с идентификатором ${id} не найден`);
    }

    return order;
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'CANCELED' | 'COMPLETED') {
    const candidate = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(`Заказ с идентификатором ${id} не найден`);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { product: true },
    });

    await this.safeNotifyStatus(updated);
    return updated;
  }

  async remove(id: string) {
    const candidate = await this.prisma.order.findFirst({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(
        'Заказ с таким идентификатором не найден',
      );
    }

    if (candidate.status !== OrderStatus.CANCELED) {
      throw new BadRequestException(
        'Удалять можно только отменённые заявки. Сначала отмените заявку.',
      );
    }

    return await this.prisma.order.delete({
      where: { id },
    });
  }

  async removeAllCanceled(type?: string) {
    const where: any = { status: OrderStatus.CANCELED };
    const normalized = typeof type === 'string' ? type.toUpperCase() : '';
    if (normalized === 'CONSULTATION') {
      where.productId = null;
    } else if (normalized === 'ORDER') {
      where.productId = { not: null };
    }

    const result = await this.prisma.order.deleteMany({ where });
    return { deleted: result.count };
  }

  private async safeNotifyNew(order: Parameters<TelegramService['notifyNewOrder']>[0]) {
    try {
      await this.telegram.notifyNewOrder(order);
    } catch (err) {
      this.logger.error(`Telegram notifyNewOrder failed for ${order.id}`, err);
    }
  }

  private async safeNotifyStatus(
    order: Parameters<TelegramService['notifyStatusChanged']>[0],
  ) {
    try {
      await this.telegram.notifyStatusChanged(order);
    } catch (err) {
      this.logger.error(
        `Telegram notifyStatusChanged failed for ${order.id}`,
        err,
      );
    }
  }
}
