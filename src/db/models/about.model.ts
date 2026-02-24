import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { FileModel } from './files.model';

@Table({ tableName: 'about' })
export class AboutModel extends Model<AboutModel> {
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  title_tk: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true })
  title_en: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: true })
  title_ru: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text_tk: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  text_en: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  text_ru: string;

  @Column({ type: DataType.STRING, allowNull: true })
  artistName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  job: string;

  @BelongsTo(() => FileModel, { as: 'avatar', foreignKey: 'avatarId' })
  avatar: FileModel;

  @ForeignKey(() => FileModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  avatarId: number;

}
