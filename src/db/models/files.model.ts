import { FileTypeEnum } from '@common/enums';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { AboutModel } from './about.model';

@Table({ tableName: 'files' })
export class FileModel extends Model<FileModel> {

  @Column({ type: DataType.STRING, allowNull: false })
  file!: string;

  @Column({
    type: DataType.ENUM(...Object.values(FileTypeEnum)),
    allowNull: false,
    defaultValue: FileTypeEnum.PHOTO,
  })
  fileType?: FileTypeEnum;

  //it save in seconds
  @Column({ type: DataType.INTEGER, allowNull: true })
  duration?: number;

  @BelongsTo(() => AboutModel)
  about?: AboutModel;

  @ForeignKey(() => AboutModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  aboutId?: number;
}
