import { responseMessage } from '@common/http';
import { UserModel } from '@db/models';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { UUID } from 'crypto';
import { I18nContext } from 'nestjs-i18n';
import { Op } from 'sequelize';
import { UserType } from '../../../common/enums/user-type.enum';
import { Pagination, type PaginationRequest } from '../../../common/libs/pagination';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserQueryDto } from '../dto/query-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
  protected salt: number;
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: typeof UserModel,
  ) {
    this.salt = 10;
  }
  async create(dto: CreateUserDto, i18n?: I18nContext) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, this.salt);
      const beforeCreate = await this.userRepo.findOne({
        where: { email: dto.email, isDeleted: false },
      });
      if (beforeCreate) throw new ConflictException('Username already exist');
      const newUser = await this.userRepo.create({
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
        isSuper: dto.isSuper,
        notify: dto.notify,
        isDeleted: false,
        type: dto.isSuper ? UserType.ADMIN : UserType.USER,
      });

      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async findAll(pagination: PaginationRequest<UserQueryDto>, _query: UserQueryDto) {
    const { limit, skip, page, orderDirection } = pagination;
    const { orderBy } = pagination;
    const where: any = {};

    if (_query.search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${_query.search}%` } },
        { fullName: { [Op.iLike]: `%${_query.search}%` } },
      ];
    }

    const { rows, count } = await this.userRepo.findAndCountAll({
      where: where,
      limit: limit,
      offset: skip,
      include: [],
      order: orderBy && orderDirection ? [[orderBy, orderDirection]] : undefined,
    });
    const mapped = await Promise.all(
      rows.map(async (user) => await UserMapper.toClient(user)),
    );

    return Pagination.of<any, ResponseUserDto>(
      pagination,
      count,
      mapped,
    );
  }

  async getUserByUsername(
    email: string,
    type?: 'admin' | 'user',
  ): Promise<any> {
    return await this.userRepo.findOne({
      where: {
        email: email,
        type: type ? type : UserType.ADMIN,
        isDeleted: false,
      },
      include: [],
    });
  }

  async checkUserNameExist(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async getById(id: UUID) {
    return await this.userRepo.findByPk(id);
  }

  async getProfile(id: UUID) {
    const user = await this.userRepo.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toClient(user as any);
  }

  async updateProfile(id: UUID, dto: UpdateProfileDto, i18n: I18nContext) {
    const user = await this.userRepo.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, this.salt)
      : user.password;
    await user.update({
      fullName: dto.fullName ?? user.fullName,
      password: hashedPassword,

    });
    return responseMessage({ action: 'update', data: user, i18n });
  }

  async update(id: string, data: CreateUserDto, i18n: I18nContext) {
    const where = { id: id, isDeleted: false };
    const user = await this.userRepo.findOne({
      where: where,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, this.salt)
      : user.password;

    await user.update({
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
      isSuper: data.isSuper,
      notify: data.notify,
      isDeleted: false,
      type: data.isSuper ? UserType.ADMIN : UserType.USER,
    });
    return responseMessage({ action: 'update', data: user, i18n });
  }

  async remove(id: UUID, i18n: I18nContext) {
    await this.userRepo.destroy({ where: { id } });
    return responseMessage({ action: 'delete', data: null, i18n });
  }
}
