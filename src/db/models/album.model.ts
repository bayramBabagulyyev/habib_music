import {
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
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


}
