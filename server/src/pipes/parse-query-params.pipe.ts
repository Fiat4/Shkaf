import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class TransformQueryPipe implements PipeTransform {
  private readonly categoryValues = Object.values(ProductCategory);

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && value && typeof value === 'object') {
      return this.transformQueryParams(value);
    }
    return value;
  }

  private transformQueryParams(params: Record<string, any>): any {
    const transformed = { ...params };

    if (transformed.category && typeof transformed.category === 'string') {
      transformed.category = transformed.category.toUpperCase();

      if (!this.categoryValues.includes(transformed.category)) {
        delete transformed.category;
      }
    }

    // order: asc/desc — в нижний регистр
    // sortBy не трогаем: поля вроде popularityScore регистрозависимы
    if (transformed.order && typeof transformed.order === 'string') {
      transformed.order = transformed.order.toLowerCase();
    }

    return transformed;
  }
}
