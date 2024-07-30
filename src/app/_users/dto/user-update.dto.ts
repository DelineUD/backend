import { PartialType } from '@nestjs/swagger';

import { UserCreateDto } from '@app/_users/dto/user-create.dto';

export class UserUpdateDto extends PartialType(UserCreateDto) {}
