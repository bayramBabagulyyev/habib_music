import { PaginationDto } from '@common/global-dto';
import { Pagination, PaginationRequest } from '@common/libs/pagination';
import { AlbumModel, FileModel } from '@db/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {

  constructor(
    @Inject("ALBUM")
    private readonly albumModel: typeof AlbumModel,
  ) { }

  async create(createAlbumDto: CreateAlbumDto) {
    const created = await this.albumModel.create({ ...createAlbumDto } as AlbumModel);
    return created;
  }

  async findAll(pagination: PaginationRequest<PaginationDto>, query: PaginationDto) {

    const { limit, skip, page, orderBy, orderDirection } = pagination;
    const where: WhereOptions<AlbumModel> = {};
    if (query.search) {
      where[Op.or] = [{ title_tk: { [Op.iLike]: `%${query.search}%` } }];
    }

    const { rows, count } = await this.albumModel.findAndCountAll({
      where: where,
      include: [{ model: FileModel, as: 'file' }],
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
    });

    return Pagination.of<PaginationDto, AlbumModel>(pagination, count, rows);
  }

  findOne(id: number) {
    const album = this.albumModel.findByPk(id, {
      include: [{ model: FileModel, as: 'file' }],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;

  }

  async update(id: number, updateAlbumDto: CreateAlbumDto) {
    const album = await this.albumModel.findByPk(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    await album.update({ ...updateAlbumDto });
    return album;
  }

  async remove(id: number) {
    const album = await this.albumModel.findByPk(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    await album.destroy();
    return album;
  }
}
