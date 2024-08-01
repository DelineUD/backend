import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegStatic = require('ffmpeg-static');

const logger = new Logger('Convert');

@Injectable()
export class ConvertsService {
  async convertToMp4(inputFilePath: string, newFileName?: string): Promise<string> {
    try {
      const inputFormat = path.extname(inputFilePath).slice(1);
      const fileName = newFileName ?? path.basename(inputFilePath).split('.')[0];

      const outputDir = path.join(process.env.STATIC_PATH_FOLDER, process.env.VIDEOS_FOLDER);
      const outputPath = path.join(outputDir, `${fileName}.mp4`);

      if (!fs.existsSync(inputFilePath)) {
        throw new ForbiddenException(`Failed to convert file: ${inputFilePath} not found`);
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Convert file to mp4
      ffmpeg.setFfmpegPath(ffmpegStatic);
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputFilePath)
          .inputFormat(inputFormat)
          .audioCodec('aac')
          .videoCodec('libx264')
          .outputOptions([
            '-b:v 1000k', // Установка битрейта для видео
            '-b:a 128k', // Установка битрейта для аудио
            '-map_metadata -1',
            '-profile:v baseline', // Установка профиля baseline для максимальной совместимости
            '-level 3.0',
            '-movflags +faststart', // Обеспечивает быструю загрузку видео на веб-страницах
            '-pix_fmt yuv420p', // Установка формата пикселей для совместимости
          ])
          .output(outputPath, { end: true })
          .toFormat('mp4')
          .on('progress', (progress) => {
            if (progress.percent) {
              logger.log(`Convert processing: ${Math.floor(progress.percent)}% done`);
            }
          })
          .on('error', (err) => {
            logger.error('An error occurred: ' + err.message);
            reject(err);
          })
          .on('end', () => {
            logger.log(`${inputFilePath} converted to ${fileName}.mp4`);
            resolve();
          })
          .run();
      });

      return outputPath;
    } catch (err) {
      logger.error(`Error while convertToMp4: ${err.message}`);
      throw err;
    }
  }

  private getMulterFile(filePath: string): Express.Multer.File {
    try {
      const stats = fs.statSync(filePath);

      return {
        fieldname: 'file',
        originalname: `${path.basename(filePath, path.extname(filePath))}`,
        encoding: '7bit',
        mimetype: `video/${path.extname(filePath).slice(1)}`,
        size: stats.size,
        destination: path.dirname(filePath),
        filename: path.basename(filePath),
        path: filePath,
        buffer: null,
        stream: fs.createReadStream(filePath),
      };
    } catch (err) {
      logger.error(`Error while getMulterFile: ${err.message}`);
      throw err;
    }
  }

  async getConvertedStaticFiles(
    uploadedFiles: Express.Multer.File[],
    converter: (inputFilePath: string, newFileName?: string) => Promise<string>,
  ): Promise<Express.Multer.File[]> {
    try {
      const convertedFilesPromises = uploadedFiles.map(async (file) => {
        let convertedFile: Express.Multer.File;

        if (file.originalname.match(/\.(avi|mov)$/i)) {
          const inputFilePath = path.join(process.env.STATIC_PATH_FOLDER, process.env.VIDEOS_FOLDER, file.filename);
          const outputPath = await converter(inputFilePath);
          convertedFile = this.getMulterFile(outputPath);
        } else {
          convertedFile = file;
        }

        return convertedFile;
      });

      return await Promise.all(convertedFilesPromises);
    } catch (err) {
      logger.error(`Error while getConvertedStaticFiles: ${err.message}`);
      throw err;
    }
  }
}
