import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ComplaintPost, ComplaintPostSchema } from '@app/complaints/entities/complaint-post.entity';
import { ComplaintResume, ComplaintResumeSchema } from '@app/complaints/entities/complaint-resume.entity';
import { ComplaintVacancy, ComplaintVacancySchema } from '@app/complaints/entities/complaint-vacancy.entity';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ComplaintPost.name,
        schema: ComplaintPostSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ComplaintResume.name,
        schema: ComplaintResumeSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ComplaintVacancy.name,
        schema: ComplaintVacancySchema,
      },
    ]),
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
