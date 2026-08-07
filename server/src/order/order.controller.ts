import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/querry-order.dto';
import { TransformQueryPipe } from 'src/pipes/parse-query-params.pipe';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  @UsePipes(TransformQueryPipe)
  findAll(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: QueryOrderDto,
  ) {
    return this.orderService.findAll(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JWTAuthGuard)
  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderDto.status);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('canceled/all')
  removeAllCanceled(@Query('type') type?: 'CONSULTATION' | 'ORDER' | string) {
    return this.orderService.removeAllCanceled(type);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
