import type { UUID } from 'crypto';

export interface UserPermissionInterface {
  userId: UUID;
  permissionId: number;
}
