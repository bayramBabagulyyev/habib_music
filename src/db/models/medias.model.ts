import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { AlbumModel } from './album.model';
import { AudioModel } from './audio.model';
import { GenreMediaModel } from './genre-media.model';
import { GenreModel } from './genre.model';
import { VideoModel } from './videos.model';

@Table({ tableName: 'medias' })
export class MediaModel extends Model<MediaModel> {
  @Column({ type: DataType.STRING, allowNull: false })
  nameTk: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameRu: string;

  @Column({ type: DataType.STRING, allowNull: false })
  descriptionTk: string;

  @Column({ type: DataType.STRING, allowNull: true })
  descriptionEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  descriptionRu: string;

  @BelongsTo(() => AlbumModel)
  album: AlbumModel;

  @ForeignKey(() => AlbumModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  albumId: number;

  @HasOne(() => AudioModel)
  audio: AudioModel;

  @HasOne(() => VideoModel)
  video: VideoModel;

  @BelongsToMany(() => GenreModel, () => GenreMediaModel)
  genres: GenreModel[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  comingSoon: boolean;
}
