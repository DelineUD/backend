import { Request } from 'express';
import { extname } from 'path';

export const editFileName = (
  _: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, path: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
