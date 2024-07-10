import { Module } from '@nestjs/common';

import { ConvertsService } from './converts.service';

@Module({
  providers: [ConvertsService],
  exports: [ConvertsService],
})
export class ConvertModule {}
