import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductCategory } from '@prisma/client';
import { QueryProductDto } from './dto/querry-product.dto';
import { TransformQueryPipe } from 'src/pipes/parse-query-params.pipe';
import {
  UploadedCreateFilesDto,
  UploadedUpdateFilesDto,
} from './dto/uploaded-files.dto';
import {
  UploadedCreateFilesValidationPipe,
  UploadedUpdateFilesValidationPipe,
} from 'src/pipes/files-validation-pipes';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get(':category')
  // findAll(@Param('category', ParseCategoryPipe) category: ProductCategory, @Query() dto: QueryProductDto) {
  //   console.log(dto)
  //   return this.productService.findAll(dto, category);
  // }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar' }, { name: 'imgs' }]),
  )
  @UseGuards(JWTAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(UploadedCreateFilesValidationPipe)
    files: UploadedCreateFilesDto,
  ) {
    return this.productService.create(createProductDto, files);
  }
  @Get()
  @UsePipes(TransformQueryPipe)
  findAll(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: QueryProductDto,
  ) {
    return this.productService.findAll(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar' }, { name: 'imgs' }]),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(UploadedUpdateFilesValidationPipe)
    files: UploadedUpdateFilesDto,
  ) {
    return this.productService.update(id, updateProductDto, files);
  }
  
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
