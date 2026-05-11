import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VideoTypeEnum } from '../enums/video-type.enum';

export class CreateMediaDto {
    @ApiProperty({ type: 'string', required: true })
    @IsString()
    nameTk!: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    nameEn?: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    nameRu?: string;

    @ApiProperty({ type: 'string', required: true })
    @IsString()
    descriptionTk!: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    descriptionRu?: string;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    albumId?: number;

    @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    genreIds?: number[];

    // Audio-specific fields
    @ApiProperty({
        type: 'number',
        required: false,
        description: 'Thumbnail file ID for audio',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    thumbnailId?: number;

    @ApiProperty({
        type: 'number',
        required: false,
        description: 'Audio file ID',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    audioId?: number;

    // Video-specific fields
    @ApiProperty({
        type: 'number',
        required: false,
        description: 'Video file ID',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    videoId?: number;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    audioLyrics?: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    videoLyrics?: string;

    @ApiProperty({ type: 'boolean', required: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    comingSoon?: boolean;

    @ApiProperty({ type: 'string', enum: VideoTypeEnum, required: false })
    @IsOptional()
    @IsEnum(VideoTypeEnum)
    videoType?: VideoTypeEnum
}
