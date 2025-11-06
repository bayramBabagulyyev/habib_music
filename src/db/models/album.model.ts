import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { FileModel } from './files.model';
import { MediaModel } from './medias.model';

@Table({ tableName: 'albums' })
export class AlbumModel extends Model<AlbumModel> {

  @Column({ type: DataType.STRING, allowNull: false })
  nameTk: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameRu: string;

  @HasMany(() => MediaModel)
  medias: MediaModel[]

  @BelongsTo(() => FileModel, { as: 'file', foreignKey: 'fileId' })
  file: FileModel;

  @ForeignKey(() => FileModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileId: number;

}
