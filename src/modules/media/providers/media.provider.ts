import { AudioModel, MediaModel, VideoModel } from '@db/models';

export const mediaProvider = [
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
];
