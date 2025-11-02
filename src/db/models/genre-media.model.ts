import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { GenreModel } from './genre.model';
import { MediaModel } from './medias.model';

@Table({ tableName: 'genre_media' })
export class GenreMediaModel extends Model<GenreMediaModel> {

  @BelongsTo(() => GenreModel)
  genre: GenreModel;

  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  genreId: number;

  @BelongsTo(() => MediaModel)
  media: MediaModel;

  @ForeignKey(() => MediaModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  mediaId: number;

}
