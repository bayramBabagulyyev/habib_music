import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { FileModel } from './files.model';
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

  @BelongsTo(() => FileModel, { as: 'file', foreignKey: 'fileId' })
  file: FileModel;

  @ForeignKey(() => FileModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileId: number;

}
