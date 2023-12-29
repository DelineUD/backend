/**
 * Валидатор для преобразования значений типа - "Да" или "Нет" к логическому типу данных.
 * @param value - "Да" || "Нет".
 * @returns - True || False.
 */
export const validateBooleanOfString = ({ value }: { value: string }): boolean => {
  return value.toString().toLowerCase() === 'да';
};
