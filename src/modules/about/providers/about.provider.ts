import { AboutModel } from '@db/models';

export const aboutProvider = [
  {
    provide: 'ABOUT',
    useValue: AboutModel,
  },
];
