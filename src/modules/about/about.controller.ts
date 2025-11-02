import { TOKEN_NAME } from '@common/constants';
import { Lang } from '@common/enums';
import { PaginationParams, type PaginationRequest } from '@common/libs/pagination';
import { CurrentUser, SkipAuth } from '@modules/auth';
import { type JwtPayload } from '@modules/auth/dtos';
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { QueryAboutDto } from './dto/query.about.dto';

ApiTags('About')
@ApiBearerAuth(TOKEN_NAME)
@Controller('about')
export class AboutController {

  constructor(
    private readonly aboutService: AboutService,
  ) { }

  @Post()
  create(
    @Body() createAboutDto: CreateAboutDto,

  ) {
    return this.aboutService.create(
      createAboutDto,
    );
  }

  @SkipAuth()
  @Get()
  findAll(
    @PaginationParams() pagination: PaginationRequest<QueryAboutDto>,
    @Query() query: QueryAboutDto,
    @Headers('lang') lang: Lang,
    // @CurrentUser() user: JwtPayload,
  ) {
    return this.aboutService.findAll(pagination, query, lang);
  }

  @SkipAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('lang') lang: Lang,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.aboutService.findOne(+id, lang, user);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAboutDto: CreateAboutDto,

  ) {
    return this.aboutService.update(
      +id,
      updateAboutDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aboutService.remove(+id);
  }
}
