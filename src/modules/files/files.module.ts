import { Module } from '@nestjs/common';
import { fileProvider } from './file.provider';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ...fileProvider],
  exports: [FilesService]
})
export class FilesModule { }
