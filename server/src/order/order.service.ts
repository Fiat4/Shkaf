import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { QueryOrderDto } from './dto/querry-order.dto';
import { PopularityService } from 'src/popularity/popularity.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly PopularityService: PopularityService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { product, ...orderBaseData } = createOrderDto;


    if (!product) {
      return this.prisma.order.create({
        data: orderBaseData,
      });
    }

    // Тут можем сделать проверку на то что есть активная заявка

    const candidate = await this.prisma.product.findUnique({
      where: { id: product },
    });

    if (!candidate) {
      throw new NotFoundException('Товар с этим идентификатором не найден.');
    }

    //   const existingProductIds = existingProducts.map(p => p.id);
    //   const missingProducts = products.filter(id => !existingProductIds.includes(id));

    //   if (missingProducts.length > 0) {
    //     throw new NotFoundException(
    //       `Продукты с ID не найдены: ${missingProducts.join(', ')}`
    //     );
    //   }
    // }
    await this.PopularityService.handleOrder(candidate.id);
    const newOrder = await this.prisma.order.create({
      data: {
        ...orderBaseData,
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
    return newOrder
  }

  async findAll(dto: QueryOrderDto) {
    const { status, type } = dto;
    const where: any = {}; // Инициализируем 'where' как пустой объект

    if (status && Object.values(OrderStatus).includes(status)) {
      where.status = status; // Присваиваем свойство 'status' напрямую
    }

    if (type && type === 'CONSULTATION') {
      where.product = null
    } else if (type && type === 'ORDER') {
      where.product = {
        isNot: null
      }
    }
    return await this.prisma.order.findMany({ where });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'CANCELED' | 'COMPLETED') { 
    const candidate = await this.prisma.order.findUnique({
      where: {id}
    })

    if (!candidate) {
      throw new NotFoundException(`Заказ с индетефикатором ${id} не найден`);
    }

    return await this.prisma.order.update({
      where: {id},
      data: {
        status: status
      }
    })
  }

  // async update(id: string, updateOrderDto: UpdateOrderDto) {
  //   const existingOrder = await this.prisma.order.findUnique({
  //     where: { id },
  //   });

  //   if (!existingOrder) {
  //     throw new NotFoundException(`Заказ с индетефикатором ${id} не найден`);
  //   }

  //   const { products: newProductIds, ...orderBaseData } = updateOrderDto;

  //   const updateData: Prisma.OrderUpdateInput = {
  //     ...orderBaseData,
  //   };

  //   if (newProductIds !== undefined) {
  //     if (newProductIds.length > 0) {
  //       const existingProductsInDb = await this.prisma.product.findMany({
  //         where: {
  //           id: { in: newProductIds },
  //         },
  //         select: { id: true },
  //       });

  //       const foundProductIds = existingProductsInDb.map((p) => p.id);
  //       const missingProducts = newProductIds.filter(
  //         (productId) => !foundProductIds.includes(productId),
  //       );

  //       if (missingProducts.length > 0) {
  //         throw new NotFoundException(
  //           `Продукты с ID не найдены: ${missingProducts.join(', ')}`,
  //         );
  //       }
  //     }

  //     const currentProductIdsInOrder = existingOrder.products.map(
  //       (po) => po.productId,
  //     );
  //     const productsToAdd = newProductIds.filter(
  //       (productId) => !currentProductIdsInOrder.includes(productId),
  //     );

  //     const productsToRemove = currentProductIdsInOrder.filter(
  //       (productId) => !newProductIds.includes(productId),
  //     );

  //     if (productsToRemove.length > 0) {
  //       await this.prisma.productsOnOrder.deleteMany({
  //         where: {
  //           orderId: id,
  //           productId: { in: productsToRemove },
  //         },
  //       });
  //     }

  //     if (productsToAdd.length > 0) {
  //       await this.prisma.productsOnOrder.createMany({
  //         data: productsToAdd.map((productId) => ({
  //           orderId: id,
  //           productId: productId,
  //         })),
  //       });
  //     }
  //   }

  //   return this.prisma.order.update({
  //     where: { id },
  //     data: updateData,
  //     include: {
  //       products: {
  //         include: {
  //           product: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async remove(id: string) {
    const candidate = await this.prisma.order.findFirst({
      where: {
        id,
      },
    });
    if (!candidate) {
      throw new BadRequestException(
        'Продукт с таким идентификатором не найден',
      );
    }
  }
}
