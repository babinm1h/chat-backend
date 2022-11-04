import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { WebsocketsAdapter } from './websockets/webscokets.adapter';

async function bootstrap() {
  const PORT = process.env.PORT || 7777;
  const app = await NestFactory.create(AppModule);
  const wsAdapter = new WebsocketsAdapter(app);
  app.useWebSocketAdapter(wsAdapter);
  app.enableCors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://localhost:3001'],
  });
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

  await app.listen(PORT, () => console.log(`Started on ${PORT}`));
}
bootstrap();
