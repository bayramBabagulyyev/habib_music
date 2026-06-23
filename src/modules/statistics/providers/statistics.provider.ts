import { AlbumModel, AudioModel, MediaModel, VideoModel } from '@db/models';

export const statisticsProvider = [
    {
        provide: 'MEDIA',
        useValue: MediaModel,
    },
    {
        provide: 'AUDIO',
        useValue: AudioModel,
    },
    {
        provide: 'VIDEO',
        useValue: VideoModel,
    },
    {
        provide: 'ALBUM',
        useValue: AlbumModel,
    },
];
