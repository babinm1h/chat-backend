import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: ['http://localhost:3000'] });
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      cookie: { maxAge: 99999999 },
      saveUninitialized: false,
    }),
  );
  app.use(passport.session());

  const PORT = process.env.PORT || 7777;
  await app.listen(PORT, () => console.log(`Started on ${PORT}`));
}
bootstrap();
