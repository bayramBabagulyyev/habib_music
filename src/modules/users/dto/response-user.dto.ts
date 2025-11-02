import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import type { UUID } from 'crypto';

export class ResponseUserDto {
  @IsUUID()
  id: UUID;

  @ApiProperty({ type: 'string', required: true })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: 'string', required: true })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  fullName: string;

  @ApiProperty({ type: 'boolean', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  notify: boolean;
}
