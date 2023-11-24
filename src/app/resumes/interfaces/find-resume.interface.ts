import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IFindAllResumeParams {
  @ApiProperty({ default: '' })
  @IsString({ message: 'userId должен быть строкой!' })
  userId: string; // User _id
}

export class IFindOneResumeParams extends PartialType(IFindAllResumeParams) {
  @ApiProperty({ default: '' })
  @IsString({ message: 'id должен быть строкой!' })
  id: string; // Resume id
}
