import { ForbiddenException, Logger } from '@nestjs/common';

import { IQualification } from '@app/_users/interfaces/user.interface';
import { EUserQualification } from '@shared/consts/user-qualification.enum';

const logger = new Logger('Validate array of qualification');

/**
 * Валидатор для IQualification JSON-строки с приведением к типу IQualification[].
 * @param value - string.
 * @returns - IQualification[].
 */
export const validateArrayOfQualification = ({ value }: { value: string }): IQualification[] => {
  try {
    console.log(value);
    if (!value) return [];

    const parsedArray = JSON.parse(value);
    if (!Array.isArray(parsedArray)) {
      throw new ForbiddenException('Invalid qualifications format! Expected an array of JSON objects.');
    }

    return parsedArray.map((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new ForbiddenException('Each qualification must be an object.');
      }
      if (!('name' in item)) {
        throw new ForbiddenException('Each qualification object must have a "name" property.');
      }
      if (typeof item.name !== 'string' && !(item.name in EUserQualification)) {
        throw new ForbiddenException(`The "name" property must be a valid enum value from EUserQualification.`);
      }
      if (item.year !== undefined && typeof item.year !== 'number') {
        throw new ForbiddenException('The "year" property, if provided, must be a number.');
      }

      return item;
    });
  } catch (err) {
    logger.error('error parsing qualifications:', err.message);
    throw new ForbiddenException('Invalid qualifications format!');
  }
};
