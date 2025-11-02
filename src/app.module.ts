import { DatabaseModule } from '@db/sequelize-conf';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './modules/album/album.module';
import { BannersModule } from './modules/banners/banners.module';
import { FilesModule } from './modules/files/files.module';
import { GenreModule } from './modules/genre/genre.module';
import { MediaModule } from './modules/media/media.module';
import { AboutModule } from '@modules/about/about.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'tk',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    AuthModule,
    DatabaseModule,
    AlbumModule,
    BannersModule,
    GenreModule,
    FilesModule,
    MediaModule,
    AboutModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
