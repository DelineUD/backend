import { ForbiddenException } from '@nestjs/common';

import { EFileType, IFile } from '@shared/interfaces/file.interface';

/**
 * Валидатор для IFile JSON-строки с приведением к типу IFile[].
 * @param value - string.
 * @returns - IFile[].
 */
export const validateArrayOfFiles = ({ value }: { value: string }): IFile[] => {
  try {
    const arrOfJSON = Array.from([value]).flat();

    if (!Array.isArray(arrOfJSON)) throw new ForbiddenException('Invalid files format!');

    return arrOfJSON.map((json) => {
      const parsed: IFile = JSON.parse(json);

      if (typeof parsed !== 'object' || !('url' in parsed) || !('type' in parsed)) {
        throw new ForbiddenException('Each file must have url and type properties!');
      }
      if (!Object.values(EFileType).includes(parsed.type)) {
        throw new ForbiddenException('Invalid file type!');
      }
      if (typeof parsed.url !== 'string') {
        throw new ForbiddenException('url must be string!');
      }

      return parsed;
    });
  } catch (err) {
    throw new ForbiddenException('Invalid files format!');
  }
};
