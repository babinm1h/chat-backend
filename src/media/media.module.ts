import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { MediaService } from './media.service';

@Module({
  imports: [],
  providers: [CloudinaryProvider, MediaService],
  exports: [CloudinaryProvider, MediaService],
})
export class MediaModule {}
