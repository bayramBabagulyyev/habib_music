import { HttpResponseInterceptor } from '@common/http';
import { IEnvironment } from '@common/interfaces';
import { SwaggerConfig } from '@config';
import { Seeder } from '@db/seeders/superAdmin.seeder';
import compression from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import * as express from 'express';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { join } from 'path';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function music() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      bufferLogs: false,
    },
  );
  const config: ConfigService = app.get(ConfigService);
  await app.register(fastifyMultipart);
  const globalApiPrefix =
    config.get<IEnvironment['API_PREFIX']>('API_PREFIX') ?? 'api';
  const appVersion =
    config.get<IEnvironment['API_VERSION']>('API_VERSION') ?? '1';
  const appPort = config.get<IEnvironment['API_PORT']>('API_PORT') ?? 8000;
  const url: string = config.get<IEnvironment['API_BASE_URL']>('API_BASE_URL') ?? '';

  app.enableVersioning();
  app.enableCors({
    origin: '*',
    credentials: false,
    methods: ['PATCH', 'OPTIONS', 'GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'User-Agent', 'Access-Control-Allow-Origin']
  });

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // allow conversion underneath
      },
    }),
    // new I18nValidationPipe({

    // }),
  );

  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  // app.use(I18nMiddleware);
  app.setGlobalPrefix(globalApiPrefix);

  if (process.env.NODE_ENV !== 'production') {
    SwaggerConfig(app, appVersion, url);
  }

  // Seed super user
  Seeder.seedSuperUser()


  // await app.register(helmet, {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: [`'self'`],
  //       styleSrc: [`'self'`, `'unsafe-inline'`],
  //       imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
  //       scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //     },
  //   },
  // });


  app.use('/static', express.static(join(__dirname, '..', 'public/static/')));

  app.useStaticAssets({
    root: join(__dirname, '..', 'uploads'),
    index: false,
    prefix: '/uploads',
  });

  await app.listen(appPort, '0.0.0.0', () => {
    Logger.log(`WORKED ON ${appPort}`);
  });

  // return appPort;
}
music();
