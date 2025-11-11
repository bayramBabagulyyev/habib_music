import { TOKEN_NAME } from '@common/constants';
import { PaginationDto } from '@common/global-dto';
import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { SkipAuth } from '@modules/auth';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';


@ApiBearerAuth(TOKEN_NAME)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) { }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @SkipAuth()
  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<PaginationDto>,
    @Query() query: PaginationDto
  ) {
    return this.albumService.findAll(pagination, query);
  }

  @SkipAuth()
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
