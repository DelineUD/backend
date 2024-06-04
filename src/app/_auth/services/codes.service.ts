import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model, Types } from 'mongoose';

import { Codes } from '@app/auth/entities/codes.entity';
import generateOTPCode from '@utils/generateOTPCode';
import { ICodes } from '@app/auth/interfaces/codes.interface';

const logger = new Logger('Codes');

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Codes.name)
    private readonly codesModel: Model<Codes>,
  ) {}

  async generateCode(userId: Types.ObjectId, userPhone: string): Promise<ICodes> {
    try {
      const otpCode = generateOTPCode(4);

      const code = await this.codesModel.findOneAndUpdate(
        { userId, userPhone },
        { $set: { user_id: userId, user_phone: userPhone, otp: +otpCode } },
        { upsert: true, new: true },
      );
      if (!code) {
        throw new BadRequestException('Ошибка при создании кода авторизации!');
      }

      logger.log('Code successfully created!');

      return code;
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteCodeById(id: Types.ObjectId) {
    try {
      return await this.codesModel.findOneAndDelete({ _id: id });
    } catch (err) {
      logger.error(`Error while deleteOneById: ${err.message}`);
      throw err;
    }
  }

  async findCodeByPayload(payload: Partial<ICodes>): Promise<ICodes> {
    try {
      return await this.codesModel.findOne({ ...payload });
    } catch (err) {
      logger.error(`Error while findOneByPayload: ${(err as Error).message}`);
      throw err;
    }
  }
}
