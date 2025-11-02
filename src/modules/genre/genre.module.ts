import { GenreMediaModel, GenreModel } from '@db/models';
import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService, { provide: "GENRE", useValue: GenreModel }, { provide: "GENRE_MEDIA", useValue: GenreMediaModel }],
})
export class GenreModule { }
