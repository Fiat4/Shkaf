import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  CreateOrganizationReviewDto,
  CreateProductReviewDto,
} from './dto/create-review.dto';
import { UploadedReviewFilesDto } from './dto/upload-review-files.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UploadedReviewFilesValidationPipe } from 'src/pipes/review-files-validation.pipe';
import { ReviewQuerryDTO } from './dto/pagination-querry-dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('product')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar' }, { name: 'imgs' }]),
  )
  @UsePipes(new ValidationPipe({ transform: true })) // Оставляем ValidationPipe для @Body DTO
  createProd(
    @Body() dto: CreateProductReviewDto,
    @UploadedFiles(UploadedReviewFilesValidationPipe)
    files: UploadedReviewFilesDto,
  ) {
    console.log(dto, files)
    return this.reviewsService.createProductReview(dto, files);
  }

  @Get('product/:id')
  findReviewsByProductId(@Param() {id}: {id: string}) {
    return this.reviewsService.findReviewsByProductId(id)
  }

  @Post('organization')
  @UseInterceptors(AnyFilesInterceptor())
  createOrg(@Body() dto: CreateOrganizationReviewDto) {
    return this.reviewsService.createOrganizationReview(dto);
  }

   @Get(':type')
  findAllByType(@Param('type') type: 'organization' | 'product') {
    console.log(type)
    return this.reviewsService.findAllByType(type)
  }

  @Get()
  findAll(@Query() dto: ReviewQuerryDTO) {
    return this.reviewsService.findAll(dto)
  }
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
