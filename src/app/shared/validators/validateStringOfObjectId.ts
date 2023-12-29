import { BadRequestException } from '@nestjs/common';

import { splitDtoField } from '@helpers/splitDto';
import { REG_EXP } from '@shared/consts';

/**
 * Валидатор для преобразования строки типа - ObjectId к массиву строк из ObjectId с уникальными значениями.
 * @param value - Строка.
 * @returns - Массив строк с уникальными значениями.
 */
export const validateStringOfObjectId = ({ value }: { value: string }): undefined | string[] => {
  const arrayOfValue = splitDtoField(value);

  if (!arrayOfValue.length) return;
  arrayOfValue.map((el) => {
    if (!REG_EXP.ObjectId.test(el)) {
      throw new BadRequestException('Invalid ObjectId format!');
    }
  });

  return arrayOfValue;
};
