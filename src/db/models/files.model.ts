import { FileTypeEnum } from '@common/enums';
import {
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class FileModel extends Model<FileModel> {

  @Column({ type: DataType.STRING, allowNull: false })
  file: string;

  @Column({
    type: DataType.ENUM(...Object.values(FileTypeEnum)),
    allowNull: false,
    defaultValue: FileTypeEnum.PHOTO,
  })
  fileType: FileTypeEnum;

  //it save in seconds
  @Column({ type: DataType.INTEGER, allowNull: true })
  duration: number;

}
