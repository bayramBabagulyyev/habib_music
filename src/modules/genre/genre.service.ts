import { PaginationDto } from '@common/global-dto';
import { Pagination, PaginationRequest } from '@common/libs/pagination';
import { FileModel, GenreModel } from '@db/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @Inject("GENRE")
    private readonly genre: typeof GenreModel,
  ) { }
  async create(createGenreDto: CreateGenreDto) {
    const data = await this.genre.create({ ...createGenreDto } as GenreModel);
    return data;
  }

  async findAll(pagination: PaginationRequest<PaginationDto>, query: PaginationDto) {
    const { limit, skip, orderBy, orderDirection } = pagination;
    const where: WhereOptions<GenreModel> = {};
    if (query.search) {
      where[Op.or] = [{ title_tk: { [Op.iLike]: `%${query.search}%` } }];
    }

    const { rows, count } = await this.genre.findAndCountAll({
      where: where,
      include: [{ model: FileModel, as: 'file' }],
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
    });

    return Pagination.of<PaginationDto, GenreModel>(pagination, count, rows);
  }

  findOne(id: number) {
    const genre = this.genre.findByPk(id, {
      include: [{ model: FileModel, as: 'file' }],
    });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }

  async update(id: number, updateGenreDto: CreateGenreDto) {
    const genre = await this.genre.findByPk(id);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    await genre.update({ ...updateGenreDto });
    return genre;
  }

  async remove(id: number) {
    const album = await this.genre.findByPk(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    await album.destroy();
    return album;
  }
}
