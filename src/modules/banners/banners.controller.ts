import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { CurrentUser, SkipAuth, TOKEN_NAME } from '@modules/auth';
import type { JwtPayload } from '@modules/auth/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
@ApiBearerAuth(TOKEN_NAME)
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }


  @Post()
  create(
    @Body() createBannerDto: CreateBannerDto,

  ) {
    return this.bannersService.create(createBannerDto);
  }

  @SkipAuth()
  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<QueryBannerDto>,
    @Query() query: QueryBannerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bannersService.findAll(pagination, query, user);
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannersService.update(
      +id,
      updateBannerDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(+id);
  }
}
