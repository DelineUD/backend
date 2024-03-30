import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IComplaint, IComplaintsResponse } from '@app/complaints/interfaces/complaint.interface';
import { ComplaintPost } from '@app/complaints/entities/complaint-post.entity';
import { ComplaintResume } from '@app/complaints/entities/complaint-resume.entity';
import { ComplaintVacancy } from '@app/complaints/entities/complaint-vacancy.entity';
import { ComplaintList, ComplaintTypes } from '@app/complaints/consts';
import { CreateComplaintDto } from './dto/create-complaint.dto';

const logger = new Logger('Complaints');

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(ComplaintPost.name) private readonly complaintPostModel: Model<ComplaintPost>,
    @InjectModel(ComplaintResume.name) private readonly complaintResumeModel: Model<ComplaintResume>,
    @InjectModel(ComplaintVacancy.name) private readonly complaintVacancyModel: Model<ComplaintVacancy>,
  ) {}

  async create(userId: Types.ObjectId, { type, id, ...restCreateComplaintDto }: CreateComplaintDto): Promise<void> {
    try {
      let model: Model<IComplaint>;

      switch (type) {
        case ComplaintTypes.POST:
          model = this.complaintPostModel;
          break;
        case ComplaintTypes.RESUME:
          model = this.complaintResumeModel;
          break;
        case ComplaintTypes.VACANCY:
          model = this.complaintVacancyModel;
          break;
        default:
          throw new BadRequestException('Invalid complaint type');
      }

      await this.createComplaintByType(
        { type, id: new Types.ObjectId(id), authorId: userId, ...restCreateComplaintDto },
        model,
      );
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async createComplaintByType(
    { reason, ...restComplaintDto }: IComplaint,
    model: Model<IComplaint>,
  ): Promise<IComplaint> {
    const complaint = model.create({ ...restComplaintDto, reason: reason.map((key) => ComplaintList[key]) });
    logger.log(`Complaint successfully created!`);
    return complaint;
  }

  async findAllByPayload<T>(model: Model<T>, payload: Partial<IComplaint>) {
    try {
      return await model.find({ ...payload }).exec();
    } catch (err) {
      logger.error(`Error while createComplaintByType: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllPostComplaints(): Promise<IComplaint[]> {
    try {
      return await this.complaintPostModel.find().exec();
    } catch (err) {
      logger.error(`Error while findAllPostComplaints: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllResumeComplaints(): Promise<IComplaint[]> {
    try {
      return await this.complaintResumeModel.find().exec();
    } catch (err) {
      logger.error(`Error while findAllResumeComplaints: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllVacancyComplaints(): Promise<IComplaint[]> {
    try {
      return await this.complaintVacancyModel.find().exec();
    } catch (err) {
      logger.error(`Error while findAllVacancyComplaints: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllByAuthorId(authorId: Types.ObjectId) {
    try {
      const complaints = await Promise.allSettled([
        ...(await this.findAllByPayload(this.complaintPostModel, { authorId })),
        ...(await this.findAllByPayload(this.complaintResumeModel, { authorId })),
        ...(await this.findAllByPayload(this.complaintVacancyModel, { authorId })),
      ]);

      return complaints
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<IComplaint>).value)
        .flat();
    } catch (err) {
      logger.error(`Error while findAllByAuthorId: ${(err as Error).message}`);
      throw err;
    }
  }

  getComplaints(): IComplaintsResponse[] {
    try {
      return Object.keys(ComplaintList).map((key) => ({
        code: key,
        name: ComplaintList[key as keyof typeof ComplaintList],
      }));
    } catch (err) {
      logger.error(`Error while getComplaints: ${(err as Error).message}`);
      throw err;
    }
  }
}
