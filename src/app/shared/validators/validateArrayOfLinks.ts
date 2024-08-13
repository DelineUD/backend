import { ForbiddenException, Logger } from '@nestjs/common';

import { ILink } from '@app/_users/interfaces/user.interface';

const logger = new Logger('Validate array of links');

/**
 * Валидатор для массива JSON-строк с приведением к типу ILink[].
 * @param value - string.
 * @returns - ILink[].
 */
export const validateArrayOfLinks = ({ value }: { value: string }): ILink[] => {
  try {
    if (!value) return [];

    const parsedArray = JSON.parse(value);
    if (!Array.isArray(parsedArray)) {
      throw new ForbiddenException('Invalid links format! Expected an array of JSON objects.');
    }

    return parsedArray.map((item) => {
      if (typeof item !== 'object' || item === null || !('url' in item)) {
        throw new ForbiddenException('Each link must be an object with at least a "url" property.');
      }
      if (typeof item.url !== 'string') {
        throw new ForbiddenException('The "url" property must be a string.');
      }
      if (item.name !== undefined && typeof item.name !== 'string') {
        throw new ForbiddenException('The "name" property, if provided, must be a string.');
      }

      return item;
    });
  } catch (err) {
    logger.error('error parsing links:', err.message);
    throw new ForbiddenException('Invalid links format!');
  }
};
