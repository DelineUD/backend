import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegStaticPath from 'ffmpeg-static';

const logger = new Logger('Converts');

@Injectable()
export class ConvertsService {
  async convertToMp4(inputFile: Express.Multer.File, newFileName: string): Promise<Express.Multer.File> {
    try {
      const { filename } = inputFile;

      const inputFormat = path.extname(filename).slice(1);
      const outputDir = path.join(process.env.STATIC_PATH_FOLDER, process.env.VIDEOS_FOLDER);

      const outputPath = path.join(outputDir, `${newFileName}.mp4`);
      const inputPath = path.join(outputDir, filename);

      if (!fs.existsSync(inputPath)) throw new ForbiddenException(`Failed to convert file: ${inputPath} not found`);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outStream = fs.createWriteStream(outputPath);

      ffmpeg.setFfmpegPath(ffmpegStaticPath);
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .inputFormat(inputFormat)
          .audioCodec('aac')
          .videoCodec('libx264')
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
            logger.log(`${filename} converted to ${newFileName}.mp4`);
            resolve();
          })
          .pipe(outStream, { end: true });
      });

      const stats = fs.statSync(outputPath);
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: `${newFileName}.mp4`,
        encoding: '7bit',
        mimetype: 'video/mp4',
        size: stats.size,
        destination: path.dirname(outputPath),
        filename: path.basename(outputPath),
        path: outputPath,
        buffer: null,
        stream: fs.createReadStream(outputPath),
      };

      return file;
    } catch (err) {
      logger.error(`Error while convertToMp4: ${err.message}`);
      throw err;
    }
  }
}
