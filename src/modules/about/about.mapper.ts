import { Lang } from '@common/enums';
import { AboutModel } from '@db/models';
import { ResponseAboutDto } from './dto/response-about.dto';

export class AboutMapper {
  public static toClient(model: AboutModel, lang: Lang) {
    const dto = new ResponseAboutDto();
    dto.id = model.id ?? null;
    dto.title = model[`title_${lang}`]
      ? model[`title_${lang}`]
      : model.title_tk;
    dto.text = model[`text_${lang}`] ? model[`text_${lang}`] : model.text_tk;

    dto.createdAt = model.createdAt ?? null;
    dto.updatedAt = model.updatedAt ?? null;
    dto.title_tk = model.title_tk;
    dto.title_en = model.title_en;
    dto.title_ru = model.title_ru;
    dto.text_tk = model.text_tk;
    dto.text_en = model.text_en;
    dto.text_ru = model.text_ru;
    dto.artistName = model.artistName;
    dto.job = model.job;
    return dto;
  }
}
