import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@app/users/users.module';
import { FiltersModule } from '@app/filters/filters.module';
import { ResumeEntity, ResumeSchema } from './entities/resume.entity';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ResumeEntity.name,
        schema: ResumeSchema,
      },
    ]),
    FiltersModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
