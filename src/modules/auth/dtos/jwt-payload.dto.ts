import { UserType } from '@common/enums';
import type { UUID } from 'crypto';

export interface JwtPayload {
  id: UUID;
  email: string;
  type: UserType;
  isSuper: boolean;
}
