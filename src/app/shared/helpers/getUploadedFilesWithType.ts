import { ForbiddenException } from '@nestjs/common';

import { EFileType } from '@shared/interfaces/file.interface';

export function getUploadedFilesWithType<T>(files: Express.Multer.File[]): T[] {
  return files.map((f) => {
    const { mimetype, filename } = f;
    const type = mimetype.startsWith('image/')
      ? EFileType.Image
      : mimetype.startsWith('video/')
      ? EFileType.Video
      : null;

    if (!type) throw new ForbiddenException('Unsupported file type!');

    const resourceDir = type === EFileType.Image ? process.env.IMAGES_FOLDER : process.env.VIDEOS_FOLDER;

    return {
      url: `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${resourceDir}/${filename}`,
      type,
    } as T;
  });
}
