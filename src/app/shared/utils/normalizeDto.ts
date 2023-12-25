import { INormalizeDto } from '@shared/interfaces/normalize-dto.interface';

/**
 * Утилита для приведение данных с гет к виду модели.
 * @param dto - данные c гет { author: string, id: string, ... }.
 * @param prefix - Префикс параметров с гет (_prefix1).
 * @returns - Массив нормализованных моделей.
 */

function normalizeDto<T extends INormalizeDto>(dto: T, prefix: string): INormalizeDto[] {
  const { authorId, ...rest } = dto;
  const entities: INormalizeDto[] = [];

  // Сортировка ключей dto по префиксу и добавление в массив сущностей под своим индексом
  Object.keys(rest).forEach((key) => {
    const count = +key[key.length - 1] - 1; // Индекс сущности
    const prefixHere = `${prefix}${count + 1}`; // Префикс с индексом

    // Определяем нужный префикс
    if (key.endsWith(prefixHere)) {
      entities[count] = {
        ...entities[count],
        authorId,
        [key.replace(prefixHere, '')]: rest[key],
      };
    }
  });

  // Сущности у которых есть id
  return entities.filter((e) => e.id);
}

export default normalizeDto;
