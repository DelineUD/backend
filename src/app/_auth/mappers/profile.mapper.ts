import { IProfileResponse } from '@app/_auth/interfaces/profile-response.interface';
import { UserEntity } from '@app/_users/entities/user.entity';

export function profileMapper({
  _id,
  first_name,
  last_name,
  phone,
  email,
  avatar,
  preferences: { is_eula_approved },
}: Partial<UserEntity>): IProfileResponse {
  return {
    _id,
    first_name,
    last_name,
    phone,
    email,
    avatar: avatar ?? null,
    is_eula_approved: is_eula_approved ?? false,
  };
}
