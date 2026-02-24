import { Lang, UserType } from '@common/enums';
import { responseMessage } from '@common/http';
import { Pagination, PaginationRequest } from '@common/libs/pagination';
import { AboutModel, FileModel } from '@db/models';
import { JwtPayload } from '@modules/auth/dtos';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AboutMapper } from './about.mapper';
import { CreateAboutDto } from './dto/create-about.dto';
import { QueryAboutDto } from './dto/query.about.dto';
import { ResponseAboutDto } from './dto/response-about.dto';

@Injectable()
export class AboutService {
  protected readonly sloganPath: string;
  constructor(
    @Inject('ABOUT')
    private readonly about: typeof AboutModel,
  ) {

  }
  async create(
    dto: CreateAboutDto
  ) {

    const newAbout = await this.about.create({
      title_tk: dto.title_tk,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      text_tk: dto.text_tk,
      text_en: dto.text_en,
      text_ru: dto.text_ru,
      job: dto.job,
      artistName: dto.artistName,
      avatarId: dto.avatarId,
    } as AboutModel);
    return responseMessage({ action: 'create', data: newAbout });
  }

  async findAll(
    pagination: PaginationRequest<QueryAboutDto>,
    query: QueryAboutDto,
    lang: Lang,
  ) {
    const { limit, skip, page, orderBy, orderDirection } = pagination;
    const where: any = {};
    if (query.search) {
      where[Op.or] = [
        { title_tk: { [Op.iLike]: `%${query.search}%` } },
        { title_en: { [Op.iLike]: `%${query.search}%` } },
        { title_ru: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    const { rows, count } = await this.about.findAndCountAll({
      where: where,
      include: [{ model: FileModel, as: 'avatar' }],
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
    });
    const mapped = rows.map((each) =>
      AboutMapper.toClient(each, lang),
    );
    return Pagination.of<QueryAboutDto, ResponseAboutDto>(pagination, count, mapped);
  }

  async findOne(id: number, lang: Lang, user: JwtPayload) {
    const about = await this.about.findByPk(id, {
      include: [{ model: FileModel, as: 'avatar' }],
    });
    if (!about) {
      throw new NotFoundException('About not found');
    }
    const mapped =
      user?.type === UserType.ADMIN
        ? about.get({ plain: true })
        : AboutMapper.toClient(about, lang);

    return responseMessage({ action: 'success', data: mapped });
  }

  async update(
    id: number,
    dto: Partial<CreateAboutDto>,

  ) {
    const about = await this.about.findByPk(id);
    if (!about) {
      throw new NotFoundException('About not found');
    }

    await about.update({
      title_tk: dto.title_tk,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      text_tk: dto.text_tk,
      text_en: dto.text_en,
      text_ru: dto.text_ru,
      artistName: dto.artistName,
      job: dto.job,
      avatarId: dto.avatarId,
    });
    const mapped = AboutMapper.toClient(about, Lang.TK);
    return responseMessage({ action: 'update', data: mapped });
  }

  async remove(id: number) {
    const about = await this.about.findByPk(id);
    if (!about) {
      throw new NotFoundException('About not found');
    }
    await about.destroy();
    return responseMessage({ action: 'delete', data: null });
  }
}
