import { AlbumModel, AudioModel, ReelsModel, VideoModel } from '@db/models';

export const statisticsProvider = [
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
    {
        provide: 'REELS',
        useValue: ReelsModel,
    },
];
