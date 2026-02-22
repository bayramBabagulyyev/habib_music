import { TOKEN_NAME } from '@common/constants';
import { editFileName, fileFilter } from '@modules/files/utils';
import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'fastify-multer';
import { existsSync, mkdirSync } from 'fs';
import { CreateFilesDto } from './dto/create-file.dto';
import { MulterFile } from './file.mapper';
import { FilesService } from './files.service';
import { FastifyFilesInterceptor } from './interceptor/fastify-files-interceptor';

@ApiBearerAuth(TOKEN_NAME)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FastifyFilesInterceptor('file', 15, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const directory = `./uploads`;
          if (!existsSync(directory)) {
            mkdirSync(directory, { recursive: true });
          }
          cb(null, directory);
        },
        filename: editFileName as any,
      }),
      fileFilter: fileFilter,
    }),
  )
  create(@Body() createFileDto: CreateFilesDto,
    @UploadedFiles() files: MulterFile[],) {
    return this.filesService.create(createFileDto, files);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
