import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { aboutProvider } from './providers/about.provider';

@Module({
  controllers: [AboutController],
  providers: [AboutService, ...aboutProvider],
  exports: [AboutService],
})
export class AboutModule {}
