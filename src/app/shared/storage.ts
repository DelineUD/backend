import * as path from 'path';
import { configDotenv } from 'dotenv';
import { diskStorage } from 'multer';

import { editFileName } from '@utils/editFileName';

configDotenv({ path: path.resolve(__dirname, `../../../envs/.${process.env.NODE_ENV}.env`) });

export const fileStorage = diskStorage({
  destination: `${process.env.STATIC_PATH_FOLDER}`,
  filename: editFileName,
});
