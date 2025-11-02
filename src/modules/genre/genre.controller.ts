import { PaginationDto } from '@common/global-dto';
import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<PaginationDto>,
    @Query() query: PaginationDto
  ) {
    return this.genreService.findAll(pagination, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: CreateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }
}
