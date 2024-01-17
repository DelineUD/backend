import { BadRequestException } from '@nestjs/common';

/**
 * Валидатор для итерируемых строк типа - "string, string, string".
 * @param value - Входное значение.
 * @returns - Строка.
 */
export const validateArrayOfString = ({ value }: { value: string }): string => {
  if (!value.toString()) {
    throw new BadRequestException(`Значение ${value} должно быть строкой!`);
  }

  const arrayOfValue = value.split(',');
  arrayOfValue.forEach((el) => {
    if (!isNaN(Number(el))) {
      throw new BadRequestException(`Ошибка при обработке значение: "${el}". Все элементы должны быть строкой!`);
    }
  });

  return value;
};
