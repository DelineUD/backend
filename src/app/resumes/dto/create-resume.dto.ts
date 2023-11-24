import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ResumeDto } from './resume.dto';

export class CreateResumeDto extends PartialType(ResumeDto) {
  /* For swagger - delete all when release */
  @ApiProperty({ default: '1' })
  readonly id: string;
  @ApiProperty({ default: 'Frontend Developer' })
  readonly title: string;
  @ApiProperty({ default: '65575899efa334db8c725608' })
  readonly author: string;
}
