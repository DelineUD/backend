import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ResumeDto {
  // Personal information
  @IsString() readonly id: string;
  @IsString() readonly title: string;
  @IsNotEmpty() readonly author: string;

  // Resume information
  @IsOptional() @IsNumber() minCost?: number;
  @IsOptional() @IsNumber() maxCost?: number;
}
