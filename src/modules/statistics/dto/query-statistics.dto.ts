import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryStatisticsDto {
    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2025-01-01' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2025-12-31' })
    @IsOptional()
    @IsString()
    endDate?: string;
}
