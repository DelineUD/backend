import { IsEmail, IsNotEmpty } from 'class-validator';
//import { TaskDto } from '../../tasks/dto/task.dto';

export class UserDto {
  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  vpass?: number;
}
