import { PartialType } from '@nestjs/mapped-types';
import { CreatePopularityDto } from './create-popularity.dto';

export class UpdatePopularityDto extends PartialType(CreatePopularityDto) {}
