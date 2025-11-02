import { UserModel } from "@db/models";

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useValue: UserModel,
  },
];
