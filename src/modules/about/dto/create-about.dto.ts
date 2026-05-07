import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
  job?: string;

  @ApiProperty({ type: 'number', isArray: true, required: false })
  @IsArray()
  @IsOptional()
  avatarIds?: number[];

}
