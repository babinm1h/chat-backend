import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class MediaService {
  async image(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream({ folder: 'chatNest/images' }, async (err, result) => {
          if (err || !result) {
            throw new BadRequestException('File upload error' + err?.message);
          }
          resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }

  async video(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'chatNest/video', resource_type: 'video' },
          async (err, result) => {
            if (err || !result) {
              throw new BadRequestException('File upload error' + err?.message);
            }
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  async audio(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'chatNest/audio', resource_type: 'video' },
          async (err, result) => {
            if (err || !result) {
              throw new BadRequestException('File upload error' + err?.message);
            }
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  async file(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'chatNest/files', resource_type: 'raw' },
          async (err, result) => {
            if (err || !result) {
              throw new BadRequestException('File upload error' + err?.message);
            }
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }
}
