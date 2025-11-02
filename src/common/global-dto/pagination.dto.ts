import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderDirection } from './order-direction.dto';

export abstract class PaginationDto {

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  page?: number;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  orderBy?: string;

  @ApiProperty({
    enum: OrderDirection,
    required: false,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(OrderDirection)
  @IsOptional()
  orderDirection?: OrderDirection;
}
