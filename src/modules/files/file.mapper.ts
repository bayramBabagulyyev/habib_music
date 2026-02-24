import { FileTypeEnum } from '@common/enums';
import { FileResponseDto } from '@common/global-dto/response-file.dto';
import { FileHelper } from '@common/helpers/file-delete.helper';
import { VideoHelper } from '@common/helpers/video-helper';
import { FileModel } from '@db/models';
import { Request } from 'express';
import { CreateFilesDto } from './dto/create-file.dto';



export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename: string;
  path: string;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
}
interface FileMapper {
  file: MulterFile;
  req: Request;
}

interface FilesMapper {
  files: MulterFile[];
  req: Request;
}


export class ImageMapper {
  private static API_BASE_URL = process.env.API_BASE_URL;

  public static toDto(entity: FileModel): FileResponseDto {
    const dto = new FileResponseDto();
    dto.id = entity.id as number;
    dto.file = entity && entity.dataValues.file ? this.API_BASE_URL + '/' + entity.dataValues.file : "";
    dto.duration = entity.duration;
    dto.fileType = entity.fileType;
    return dto;
  }

  public static async toDataBase(dto: CreateFilesDto, files: MulterFile[]) {
    const mappedFiles: CreateFilesDto[] = await Promise.all(files.map(async (file) => {
      return {
        file: file.path,
        fileType: FileHelper.getFileType(file.mimetype),
        duration: FileHelper.getFileType(file.mimetype) != FileTypeEnum.PHOTO ? await VideoHelper.getVideoDuration(file.path) : null,
      } as unknown as CreateFilesDto
    }));
    return mappedFiles;
  }
}
