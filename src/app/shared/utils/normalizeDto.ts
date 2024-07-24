import { INormalizeDto } from '@shared/interfaces/normalize-dto.interface';

/**
 * Утилита для приведение данных с гет к виду модели.
 * @param dto - данные c Get Course.
 * @param prefix - Префикс параметров с гет (_prefix1).
 * @returns - Массив нормализованных моделей.
 */

function normalizeDto<T extends INormalizeDto>(dto: Partial<T>, prefix: string): INormalizeDto[] {
  const entities: INormalizeDto[] = [];

  // Сортировка ключей dto по префиксу и добавление в массив сущностей под своим индексом
  Object.keys(dto).forEach((key) => {
    const count = +key[key.length - 1] - 1; // Индекс сущности
    const prefixHere = `${prefix}${count + 1}`; // Префикс с индексом

    // Определяем нужный префикс
    if (key.endsWith(prefixHere)) {
      entities[count] = {
        ...entities[count],
        [key.replace(prefixHere, '')]: dto[key],
      };
    }
  });

  // Сущности у которых есть id
  return entities.filter((e) => e.id);
}

export default normalizeDto;
