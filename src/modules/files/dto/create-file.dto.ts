import { FileTypeEnum } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateFilesDto {

    @IsOptional()
    @Exclude()
    type?: FileTypeEnum;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Files to upload' })
    @IsOptional()
    file?: string;

    @IsOptional()
    @Exclude()
    duration?: FileTypeEnum;

    @ApiProperty({ enum: [0, 1], description: 'Whether to convert the file' })
    @IsOptional()
    @IsEnum([0, 1])
    convert?: 1 | 0;


}