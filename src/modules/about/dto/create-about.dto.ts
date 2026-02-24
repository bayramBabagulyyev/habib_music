import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAboutDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title_tk: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  title_en: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  title_ru: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  text_tk: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  text_en: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  text_ru: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  artistName: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  job: string;

  @ApiProperty({ type: 'number', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  avatarId: number;

}
