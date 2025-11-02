import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { mediaProvider } from './providers/media.provider';

@Module({
  controllers: [MediaController],
  providers: [MediaService, ...mediaProvider],
  exports: [MediaService],
})
export class MediaModule { }
