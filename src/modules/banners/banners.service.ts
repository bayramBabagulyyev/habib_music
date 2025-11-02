import { UserType } from '@common/enums';
import { responseMessage } from '@common/http';
import { Pagination, PaginationRequest } from '@common/libs/pagination';
import { BannerModel } from '@db/models/banner.model';
import { FileModel } from '@db/models/files.model';
import { JwtPayload } from '@modules/auth/dtos';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Op, WhereOptions } from 'sequelize';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  protected readonly urlImage: string;
  protected readonly sloganPath: string;
  constructor(
    @Inject('BANNER')
    private readonly banner: typeof BannerModel,
    private configService: ConfigService,
  ) { }
  async create(
    dto: CreateBannerDto,
  ) {

    const newBanner = await this.banner.create({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      type: dto.type,
      fileId: dto.fileId,
      priority: dto.priority,
    } as BannerModel);
    return responseMessage({ action: 'create', data: newBanner });
  }

  async findAll(
    pagination: PaginationRequest<QueryBannerDto>,
    query: QueryBannerDto,
    user: JwtPayload,
  ) {
    if (user && user.type === UserType.ADMIN) {
      const { limit, skip, page, orderBy, orderDirection } = pagination;
      const where: WhereOptions<BannerModel> = {};
      if (query.search) {
        where[Op.or] = [{ title: { [Op.iLike]: `%${query.search}%` } }];
      }
      if (query.type) {
        where.type = query.type;
      }

      if (query.startDate) {
        where['startDate'] = { [Op.gte]: query.startDate };
      }

      if (query.endDate) {
        where['endDate'] = { [Op.lte]: query.endDate };
      }

      const { rows, count } = await this.banner.findAndCountAll({
        where: where,
        limit: limit,
        offset: skip,
        order: [[orderBy, orderDirection]],
        include: [{ model: FileModel, as: 'file' }],
      });

      return Pagination.of<QueryBannerDto, BannerModel>(pagination, count, rows);
    }
    const { limit, skip, page, orderBy, orderDirection } = pagination;
    const where: any = {
      [Op.and]: [
        {
          [Op.or]: [
            { startDate: { [Op.lte]: new Date() } },
            { startDate: null },
          ],
        },
        { [Op.or]: [{ endDate: { [Op.gte]: new Date() } }, { endDate: null }] },
      ],
    };
    if (query.search) {
      where[Op.or] = [{ title: { [Op.iLike]: `%${query.search}%` } }];
    }
    if (query.type) {
      where.type = query.type;
    }

    const { rows, count } = await this.banner.findAndCountAll({
      where: where,
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
      include: [{ model: FileModel, as: 'file' }],
    });

    return Pagination.of<QueryBannerDto, BannerModel>(pagination, count, rows);
  }

  async findOne(id: number) {
    const media = await this.banner.findByPk(id, {
      include: [{ model: FileModel, as: 'file' }],
    });
    if (!media) {
      throw new NotFoundException('Banner not Found!');
    }

    return responseMessage({ action: 'success', data: media });
  }

  async update(
    id: number,
    dto: UpdateBannerDto
  ) {
    const media = await this.banner.findByPk(id);
    if (!media) {
      throw new NotFoundException('Banner not Found!');
    }

    await media.update({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      type: dto.type,
      fileId: dto.fileId,
      priority: dto.priority,
    });

    await media.reload({
      include: [{ model: FileModel, as: 'file' }],
    });

    return responseMessage({ action: 'update', data: media });
  }

  async remove(id: number) {
    const media = await this.banner.findByPk(id);
    if (!media) {
      throw new NotFoundException('Banner not Found!');
    }
    await media.destroy();
    return responseMessage({ action: 'delete', data: null });
  }
}
