import { IsOptional } from 'class-validator';

export class FileResponseDto {

  id?: number;

  file?: string;

  fileType?: string;

  @IsOptional()
  duration?: number;

}

