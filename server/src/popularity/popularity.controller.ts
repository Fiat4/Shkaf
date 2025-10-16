import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PopularityService } from './popularity.service';
import { CreatePopularityDto } from './dto/create-popularity.dto';
import { UpdatePopularityDto } from './dto/update-popularity.dto';

@Controller('popularity')
export class PopularityController {
  constructor(private readonly popularityService: PopularityService) {}

}
