import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { FileModel } from './files.model';

export enum BannerTypeEnum {
  BANNER = 'banner',
  TIZ = 'tiz',
}

@Table({ tableName: 'banner' })
export class BannerModel extends Model<BannerModel> {

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({
    type: DataType.ENUM(...Object.values(BannerTypeEnum)),
    allowNull: false,
    defaultValue: BannerTypeEnum.BANNER,
  })
  type: BannerTypeEnum;

  @Column({ type: DataType.DATE, allowNull: true })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endDate: Date;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 1 })
  priority: number;

  @BelongsTo(() => FileModel, { as: 'file', foreignKey: 'fileId' })
  file: FileModel;

  @ForeignKey(() => FileModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileId: number;

}


