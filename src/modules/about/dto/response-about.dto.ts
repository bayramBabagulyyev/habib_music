import { CommonDto } from '@common/global-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ResponseAboutDto extends CommonDto {

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  text: string;

  @ApiProperty({ type: 'number', required: true })
  @Type(() => Number)
  @IsNumber()
  artistName: string;

  @ApiProperty({ type: 'number', required: true })
  @Type(() => Number)
  @IsNumber()
  job: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title_tk: string

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title_en: string

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title_ru: string

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  text_tk: string

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  text_en: string

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  text_ru: string

  // file: any
}
