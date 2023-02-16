import { IsNotEmpty, IsEmail } from 'class-validator';
//import { TaskDto } from '../../tasks/dto/task.dto';

export class UserDto {
  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

 // @IsNotEmpty()
 // tasks: TaskDto[];
 @IsNotEmpty()
 vpass: number;
}