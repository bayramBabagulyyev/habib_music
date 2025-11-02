import { Column, DataType, Index, Model, Table } from 'sequelize-typescript';

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

}
