import { AlbumModel } from '@db/models';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, { provide: "ALBUM", useValue: AlbumModel }],
})
export class AlbumModule { }
