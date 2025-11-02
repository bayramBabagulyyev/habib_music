import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { bannerProvider } from './providers/banner.provider';

@Module({
  controllers: [BannersController],
  providers: [BannersService, ...bannerProvider],
  exports: [BannersService],
})
export class BannersModule {}
