import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';
import { GenreMediaModel } from './genre-media.model';
import { MediaModel } from './medias.model';

@Table({ tableName: 'genre' })
export class GenreModel extends Model<GenreModel> {

  @Column({ type: DataType.STRING, allowNull: false })
  nameTk: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameRu: string;

  @BelongsToMany(() => MediaModel, () => GenreMediaModel)
  medias: MediaModel[];

}
