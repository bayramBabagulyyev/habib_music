import type { UUID } from 'crypto';
import { UserPermissionInterface } from '../interfaces/user-permission.interface';

export class UserPermissionMapper {
  public static toModel(
    userId: UUID,
    permissionId: number,
  ): UserPermissionInterface {
    const model: UserPermissionInterface = {
      userId: userId,
      permissionId: permissionId,
    };
    return model;
  }
}
