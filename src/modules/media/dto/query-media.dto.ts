import { PaginationDto } from '@common/global-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryMediaDto extends PaginationDto {
    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    albumId?: number;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    genreId?: number;
}
