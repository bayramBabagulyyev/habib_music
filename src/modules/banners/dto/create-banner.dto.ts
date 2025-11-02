import { BannerTypeEnum } from '@db/models/banner.model';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: true, enum: BannerTypeEnum })
  @IsEnum(BannerTypeEnum)
  type: BannerTypeEnum;


  @ApiProperty({ type: 'number', required: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fileId: number;


  @ApiProperty({ type: 'number', required: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priority: number;

}
