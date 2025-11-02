import { PaginationDto } from '@common/global-dto';
import { BannerTypeEnum } from '@db/models/banner.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryBannerDto extends PaginationDto {

  @ApiProperty({ required: false, enum: BannerTypeEnum })
  @IsOptional()
  @IsEnum(BannerTypeEnum)
  type: BannerTypeEnum;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsOptional()
  endDate: Date;

}
