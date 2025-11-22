import { Lang } from '@common/enums';
import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { CurrentUser, SkipAuth, TOKEN_NAME } from '@modules/auth';
import type { JwtPayload } from '@modules/auth/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ActionMedia } from './dto/action-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';

@Controller('media')
@ApiBearerAuth(TOKEN_NAME)
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @SkipAuth()
  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<QueryMediaDto>,
    @Query() query: QueryMediaDto,
    @Headers('lang') lang: Lang,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.mediaService.findAll(pagination, query, lang, user);
  }

  @SkipAuth()
  @Get('videos')
  findVideos(
    @PaginationParams() pagination: PaginationRequest<QueryMediaDto>,
    @Query() query: QueryMediaDto,
    @Headers('lang') lang: Lang,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.mediaService.findAllVideos(pagination, query, lang, user);
  }

  @SkipAuth()
  @Get('audios')
  findAudios(
    @PaginationParams() pagination: PaginationRequest<QueryMediaDto>,
    @Query() query: QueryMediaDto,
    @Headers('lang') lang: Lang,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.mediaService.findAllAudios(pagination, query, lang, user);
  }

  @SkipAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('lang') lang: Lang,
  ) {
    return this.mediaService.findOne(+id, lang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }

  @SkipAuth()
  @Post('audio-listen/:audioId')
  likeSong(
    @Param('audioId') id: string,
    @Headers('lang') lang: Lang,
    @Body() data: ActionMedia
  ) {
    return this.mediaService.actionAudio(+id, lang, data);
  }

  @SkipAuth()
  @Post('video-listen/:videoId')
  likeVideo(
    @Param('videoId') id: string,
    @Headers('lang') lang: Lang,
    @Body() data: ActionMedia
  ) {
    return this.mediaService.actionVideo(+id, lang, data);
  }
}
