import { FileHelper } from '@common/helpers/file-delete.helper';
import { FileModel } from '@db/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import sharp from 'sharp';
import { CreateFilesDto } from './dto/create-file.dto';
import { ImageMapper, MulterFile } from './file.mapper';
const fs = require('fs').promises;


@Injectable()
export class FilesService {
  constructor(
    @Inject('FILES')
    private readonly file: typeof FileModel,
  ) { }

  async create(dto: CreateFilesDto, files: MulterFile[]) {
    try {

      const logoPath = join(process.cwd(), 'uploads', 'logo.png');

      // process each uploaded file: compress and add logo at top-right
      for (const file of files) {
        if (!file.mimetype.startsWith('image')) {
          continue;
        }
        const inputPath = file.path;
        try {
          const img = sharp(inputPath);
          const meta = await img.metadata();
          const width = meta.width || 800;

          // resize logo to ~15% of image width
          const logoBuffer = await sharp(logoPath)
            .resize(Math.max(1, Math.round(width * 0.15)))
            .webp()
            .toBuffer();
          const logoMeta = await sharp(logoBuffer).metadata();
          const left = Math.max(0, width - (logoMeta.width || 0) - 10);
          const top = 10;

          // composite logo and compress (keep PNG as PNG, others -> JPEG)
          let pipeline = sharp(inputPath).composite([{ input: logoBuffer, left, top }]);

          if (meta.format === 'png') {
            pipeline = pipeline.png({ compressionLevel: 9 });
          } else {
            pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
          }

          // write to a temp file then replace original (safer)
          const tmpPath = `${inputPath}.proc`;
          await pipeline.toFile(tmpPath);
          await fs.rename(tmpPath, inputPath);
        } catch (err) {
          // if processing fails, remove this file and rethrow to trigger outer cleanup
          FileHelper.deleteFileSilent(file.path);
          throw err;
        }
      }

      // now map to DB DTOs and bulk create
      const mappedData: CreateFilesDto[] = await ImageMapper.toDataBase(dto, files);
      const createFileDto = await this.file.bulkCreate(mappedData as any);
      return createFileDto;
    }
    catch (error) {
      files.map(file => FileHelper.deleteFileSilent(file.path));
      throw error;
    }
  }


  async findOne(id: number) {
    const file = await this.file.findByPk(id);
    if (!file) {
      throw new NotFoundException('File tapylmady!');
    }
    return ImageMapper.toDto(file);
  }

  async remove(id: number) {
    const file = await this.file.findByPk(id);
    if (!file) {
      throw new NotFoundException('File tapylmady!');
    }
    FileHelper.deleteFileSilent(file.file);
    await this.file.destroy({ where: { id } });
    return;
  }
}
