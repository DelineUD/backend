import { Logger } from '@nestjs/common';

import { transformPhoneNumber } from '@utils/transformPhoneNumber';

const logger = new Logger('Validate phone number');

/**
 * Валидатор для номера телефона.
 * @param value - string
 * @returns - string
 */
export const validatePhoneNumber = ({ value }: { value: string }) => {
  try {
    return transformPhoneNumber(value);
  } catch (err) {
    logger.error('error parsing phone number:', err.message);
  }
};
