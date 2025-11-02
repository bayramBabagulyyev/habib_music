import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  @MinLength(4)
  readonly password: string;

}

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
  })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
  })
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
  })
  @IsString()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  @MinLength(4)
  readonly password: string;

}
