import { ForbiddenException, Logger } from '@nestjs/common';

import { IQualification } from '@/app/users/interfaces/user.interface';

const logger = new Logger('ValidateArrayOfEducation');

/**
 * Validator for the IEducation JSON string with casting to type IEducation[].
 * @param value - string.
 * @returns - IEducation[].
 */
export const validateArrayOfEducation = ({ value }: { value: string }): IQualification[] => {
  try {
    if (!value) return [];

    const parsedArray = JSON.parse(value);

    if (!Array.isArray(parsedArray)) {
      throw new ForbiddenException('Invalid education format! Expected an array of JSON objects.');
    }

    return parsedArray.map((item, index) => {
      if (typeof item !== 'object' || item === null) {
        throw new ForbiddenException(`Invalid entry at index ${index}. Each education must be an object.`);
      }
      if (!('name' in item)) {
        throw new ForbiddenException(`Missing "name" property at index ${index}.`);
      }
      if ('specialization' in item && typeof item.specialization !== 'string') {
        throw new ForbiddenException(`The "specialization" property at index ${index}, if provided, must be a string.`);
      }
      if ('year' in item && item.year !== undefined && typeof item.year !== 'number') {
        throw new ForbiddenException(`The "year" property at index ${index}, if provided, must be a number.`);
      }

      return item;
    });
  } catch (err) {
    logger.error(`Error parsing education: ${err.message}`, err.stack);
    throw new ForbiddenException('Invalid education format!');
  }
};
