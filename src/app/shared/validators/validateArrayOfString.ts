import { BadRequestException } from '@nestjs/common';

/**
 * Валидатор для преобразования строки в массив из строк с уникальными значениями.
 * @param value - Строка.
 * @returns - Массив строк с уникальными значениями.
 */
export const validateArrayOfString = ({ value }: { value: string }): string[] => {
  try {
    if (!value.toString()) {
      throw new BadRequestException(`Значение ${value} должно быть строкой!`);
    }
    return [...new Set(value.split(',').map((el) => el.trim()))] ?? [];
  } catch (err) {
    throw err;
  }
};
