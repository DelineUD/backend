import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class IResumeFindAll {
  @ApiProperty({ default: '' })
  @IsMongoId()
  userId: string;
}

export class IResumeFindOne extends PartialType(IResumeFindAll) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  id: string;
}
