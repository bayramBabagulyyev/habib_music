import { Lang } from '@common/enums';
import { AboutModel } from '@db/models';
import { ImageMapper } from '@modules/files/file.mapper';
import { ResponseAboutDto } from './dto/response-about.dto';

export class AboutMapper {
  public static toClient(model: AboutModel, lang: Lang) {
    const dto = new ResponseAboutDto();
    dto.id = model.id ?? null;
    dto.title = model.dataValues[`title_${lang}`]
      ? model.dataValues[`title_${lang}`]
      : model.title_tk;
    dto.text = model.dataValues[`text_${lang}`] ? model.dataValues[`text_${lang}`] : model.text_tk;
    dto.createdAt = model.createdAt ?? null;
    dto.updatedAt = model.updatedAt ?? null;
    dto.title_tk = model.dataValues.title_tk;
    dto.title_en = model.dataValues.title_en;
    dto.title_ru = model.dataValues.title_ru;
    dto.text_tk = model.dataValues.text_tk;
    dto.text_en = model.dataValues.text_en;
    dto.text_ru = model.dataValues.text_ru;
    dto.artistName = model.dataValues.artistName;
    dto.job = model.dataValues.job;
    dto.avatar = model.dataValues.avatar ? ImageMapper.toDto(model.dataValues.avatar) : null;
    return dto;
  }
}
