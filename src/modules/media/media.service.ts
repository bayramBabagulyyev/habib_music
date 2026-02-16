import { Lang } from '@common/enums';
import { responseMessage } from '@common/http';
import { Pagination, PaginationRequest } from '@common/libs/pagination';
import { AlbumModel, AudioModel, FileModel, GenreMediaModel, GenreModel, MediaModel, VideoModel } from '@db/models';
import { JwtPayload } from '@modules/auth/dtos';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { ActionMedia } from './dto/action-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @Inject('MEDIA')
    private readonly media: typeof MediaModel,
    @Inject('AUDIO')
    private readonly audio: typeof AudioModel,
    @Inject('VIDEO')
    private readonly video: typeof VideoModel,
  ) { }

  async create(dto: CreateMediaDto) {
    // Create media record
    const newMedia = await this.media.create({
      nameTk: dto.nameTk,
      nameEn: dto.nameEn,
      nameRu: dto.nameRu,
      descriptionTk: dto.descriptionTk,
      descriptionEn: dto.descriptionEn,
      descriptionRu: dto.descriptionRu,
      albumId: dto.albumId,
    } as MediaModel);

    // Create audio or video record if IDs are provided
    if (dto.audioId && dto.thumbnailId) {
      await this.audio.create({
        mediaId: newMedia.id,
        audioId: dto.audioId,
        thumbnailId: dto.thumbnailId,
        lyrics: dto.audioLyrics,
      } as AudioModel);
    }

    if (dto.videoId && dto.thumbnailId) {
      await this.video.create({
        mediaId: newMedia.id,
        videoId: dto.videoId,
        thumbnailId: dto.thumbnailId,
        lyrics: dto.videoLyrics,
      } as VideoModel);
    }

    // Associate genres if provided
    if (dto.genreIds && dto.genreIds.length > 0) {
      const genreMediaRecords = dto.genreIds.map(genreId => ({
        mediaId: newMedia.id,
        genreId: genreId,
      }));
      await GenreMediaModel.bulkCreate(genreMediaRecords as any);
    }

    // Reload with associations
    await newMedia.reload({
      include: [
        { model: AlbumModel, as: 'album' },
        { model: AudioModel, as: 'audio' },
        { model: GenreModel, as: 'genres' },
      ],
    });

    return responseMessage({ action: 'create', data: newMedia });
  }

  async findAll(
    pagination: PaginationRequest<QueryMediaDto>,
    query: QueryMediaDto,
    lang: Lang,
    user?: JwtPayload,
  ) {
    const { limit, skip, orderBy, orderDirection } = pagination;
    const where: WhereOptions<MediaModel> = {};

    if (query.search) {
      where[Op.or] = [
        { nameTk: { [Op.iLike]: `%${query.search}%` } },
        { nameEn: { [Op.iLike]: `%${query.search}%` } },
        { nameRu: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    if (query.albumId) {
      where.albumId = query.albumId;
    }

    const include: any[] = [
      { model: AlbumModel, as: 'album' },
      {
        model: AudioModel,
        as: 'audio',
        include: [
          { model: FileModel, as: 'thumbnail' },
          { model: FileModel, as: 'audio' },
        ],
      },
      {
        model: VideoModel,
        as: 'video',
        include: [
          { model: FileModel, as: 'thumbnail' },
          { model: FileModel, as: 'video' },
        ],
      },
      { model: GenreModel, as: 'genres' },
    ];

    if (query.genreId) {
      include.push({
        model: GenreModel,
        as: 'genres',
        where: { id: query.genreId },
        required: true,
      });
    }

    const { rows, count } = await this.media.findAndCountAll({
      where: where,
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
      include: include,
      distinct: true,
    });

    return Pagination.of<QueryMediaDto, MediaModel>(pagination, count, rows);
  }


  async findAllVideos(
    pagination: PaginationRequest<QueryMediaDto>,
    query: QueryMediaDto,
    lang: Lang,
    user?: JwtPayload,
  ) {
    const { limit, skip, orderBy, orderDirection } = pagination;
    const where: WhereOptions<VideoModel> = {};
    const whereMedia: WhereOptions<MediaModel> = {};

    if (query.search) {
      whereMedia[Op.or] = [
        { nameTk: { [Op.iLike]: `%${query.search}%` } },
        { nameEn: { [Op.iLike]: `%${query.search}%` } },
        { nameRu: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    if (query.albumId) {
      whereMedia.albumId = query.albumId;
    }

    // If a genre filter is requested, add it as a nested include on the media association
    const include: any[] = [
      { model: FileModel, as: 'thumbnail' },
      { model: FileModel, as: 'video' },
    ];

    const mediaInclude: any = {
      model: MediaModel,
      as: 'media',
      where: whereMedia,
      include: [],
    };

    if (query.genreId) {
      mediaInclude.include.push({
        model: GenreModel,
        as: 'genres',
        where: { id: query.genreId },
        required: true,
      });
    }

    include.push(mediaInclude);

    const { rows, count } = await this.video.findAndCountAll({
      where: where,
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
      include: include,
      distinct: true,
    });

    return Pagination.of<QueryMediaDto, VideoModel>(pagination, count, rows);
  }

  async findAllAudios(
    pagination: PaginationRequest<QueryMediaDto>,
    query: QueryMediaDto,
    lang: Lang,
    user?: JwtPayload,
  ) {
    const { limit, skip, orderBy, orderDirection } = pagination;
    const where: WhereOptions<AudioModel> = {};
    const whereMedia: WhereOptions<MediaModel> = {};

    if (query.search) {
      whereMedia[Op.or] = [
        { nameTk: { [Op.iLike]: `%${query.search}%` } },
        { nameEn: { [Op.iLike]: `%${query.search}%` } },
        { nameRu: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    if (query.albumId) {
      whereMedia.albumId = query.albumId;
    }

    // If a genre filter is requested, add it as a nested include on the media association
    const include: any[] = [
      { model: FileModel, as: 'thumbnail' },
      { model: FileModel, as: 'audio' },
    ];

    const mediaInclude: any = {
      model: MediaModel,
      as: 'media',
      where: whereMedia,
      include: [],
    };

    if (query.genreId) {
      mediaInclude.include.push({
        model: GenreModel,
        as: 'genres',
        where: { id: query.genreId },
        required: true,
      });
    }

    include.push(mediaInclude);

    const { rows, count } = await this.audio.findAndCountAll({
      where: where,
      limit: limit,
      offset: skip,
      order: [[orderBy, orderDirection]],
      include: include,
      distinct: true,
    });

    return Pagination.of<QueryMediaDto, AudioModel>(pagination, count, rows);
  }



  async findOne(id: number, lang: Lang) {
    const media = await this.media.findByPk(id, {
      include: [
        { model: AlbumModel, as: 'album' },
        {
          model: AudioModel,
          as: 'audio',
          include: [
            { model: FileModel, as: 'thumbnail' },
            { model: FileModel, as: 'audio' },
          ],
        },
        { model: GenreModel, as: 'genres' },
      ],
    });

    if (!media) {
      throw new NotFoundException('Media not Found!');
    }

    return responseMessage({ action: 'success', data: media });
  }

  async update(id: number, dto: UpdateMediaDto) {
    const media = await this.media.findByPk(id);
    if (!media) {
      throw new NotFoundException('Media not Found!');
    }

    await media.update({
      nameTk: dto.nameTk,
      nameEn: dto.nameEn,
      nameRu: dto.nameRu,
      descriptionTk: dto.descriptionTk,
      descriptionEn: dto.descriptionEn,
      descriptionRu: dto.descriptionRu,
      albumId: dto.albumId
    });

    // Update audio if provided
    if (dto.audioId && Number(dto.audioId) > 0) {
      const audioRecord = await this.audio.findOne({ where: { mediaId: id } });
      if (audioRecord) {
        await audioRecord.update({
          audioId: dto.audioId ?? audioRecord.audioId,
          thumbnailId: dto.thumbnailId ? audioRecord.thumbnailId : audioRecord.thumbnailId,
          lyrics: dto.audioLyrics ?? audioRecord.lyrics,
        });
      }
    } else if (dto.audioId === null) {
      // If audioId is explicitly set to null, remove the audio record
      await this.audio.destroy({ where: { mediaId: id } });
    }

    // Update video if provided
    if (dto.videoId && Number(dto.videoId) > 0) {
      const videoRecord = await this.video.findOne({ where: { mediaId: id } });
      if (videoRecord) {
        await videoRecord.update({
          videoId: dto.videoId ?? videoRecord.videoId,
          thumbnailId: dto.thumbnailId ? videoRecord.thumbnailId : videoRecord.thumbnailId,
          lyrics: dto.videoLyrics ?? videoRecord.lyrics,
        });
      }
    } else if (dto.videoId === null) {
      // If videoId is explicitly set to null, remove the video record
      await this.video.destroy({ where: { mediaId: id } });
    }

    // Update genres if provided
    if (dto.genreIds) {
      await GenreMediaModel.destroy({ where: { mediaId: id } });
      if (dto.genreIds.length > 0) {
        const genreMediaRecords = dto.genreIds.map(genreId => ({
          mediaId: id,
          genreId: genreId,
        }));
        await GenreMediaModel.bulkCreate(genreMediaRecords as any);
      }
    }

    await media.reload({
      include: [
        { model: AlbumModel, as: 'album' },
        {
          model: AudioModel,
          as: 'audio',
          include: [
            { model: FileModel, as: 'thumbnail' },
            { model: FileModel, as: 'audio' },
          ],
        },
        { model: GenreModel, as: 'genres' },
      ],
    });

    return responseMessage({ action: 'update', data: media });
  }

  async remove(id: number) {
    const media = await this.media.findByPk(id);
    if (!media) {
      throw new NotFoundException('Media not Found!');
    }

    // Delete associated audio/video records (cascade should handle this)
    await this.audio.destroy({ where: { mediaId: id } });
    await this.video.destroy({ where: { mediaId: id } });
    await GenreMediaModel.destroy({ where: { mediaId: id } });

    await media.destroy();
    return responseMessage({ action: 'delete', data: null });
  }

  async actionAudio(id: number, lang: Lang, data: ActionMedia) {
    const audio = await this.audio.findByPk(id);
    if (!audio) {
      throw new NotFoundException("Audio not found");
    };
    console.log(audio.likeCount, audio.listenCount, audio.downloadCount);
    const newLikeCount = audio.likeCount ?? +0 + +data.like;
    const newListenCount = audio.listenCount ?? +0 + +data.listen;
    const newDownloadCount = audio.downloadCount ?? +0 + +data.download;

    await audio.update({
      likeCount: newLikeCount,
      listenCount: newListenCount,
      downloadCount: newDownloadCount
    })
    return
  }

  async actionVideo(id: number, lang: Lang, data: ActionMedia) {
    const video = await this.video.findByPk(id);
    if (!video) {
      throw new NotFoundException("Video not found");
    };

    const newLikeCount = video.likeCount ?? +0 + +data.like;
    const newListenCount = video.listenCount ?? +0 + +data.listen;
    const newDownloadCount = video.downloadCount ?? +0 + +data.download;

    await video.update({
      likeCount: newLikeCount,
      listenCount: newListenCount,
      downloadCount: newDownloadCount
    })
    return
  }
}
