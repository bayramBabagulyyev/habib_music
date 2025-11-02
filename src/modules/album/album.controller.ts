import { PaginationDto } from '@common/global-dto';
import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) { }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<PaginationDto>,
    @Query() query: PaginationDto
  ) {
    return this.albumService.findAll(pagination, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: CreateAlbumDto) {
    return this.albumService.update(+id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(+id);
  }
}
