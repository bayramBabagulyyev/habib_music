import { BannerModel } from '@db/models';

export const bannerProvider = [
  {
    provide: 'BANNER',
    useValue: BannerModel,
  },
];
