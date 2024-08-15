import { UserEntity } from '@/app/users/entities/user.entity';
import { IProfileResponse } from '@app/auth/interfaces/profile-response.interface';

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
