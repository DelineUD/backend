import { diskStorage } from 'multer';

import { editFileName } from '@utils/editFileName';

export const fileStorage = diskStorage({
  destination: process.env.STATIC_PATH_FOLDER,
  filename: editFileName,
});
