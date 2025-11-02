import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSuper: boolean;

  @ApiProperty({
    type: 'boolean',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  notify: boolean;
}
