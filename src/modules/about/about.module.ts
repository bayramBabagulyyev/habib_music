import { FilesModule } from '@modules/files/files.module';
import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { aboutProvider } from './providers/about.provider';

@Module({
  imports: [FilesModule],
  controllers: [AboutController],
  providers: [AboutService, ...aboutProvider],
  exports: [AboutService],
})
export class AboutModule { }
