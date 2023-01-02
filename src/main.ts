import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { WebsocketsAdapter } from './websockets/webscokets.adapter';
import * as session from 'express-session';

async function bootstrap() {
  const PORT = process.env.PORT || 7777;
  const app = await NestFactory.create(AppModule);
  const wsAdapter = new WebsocketsAdapter(app);
  app.useWebSocketAdapter(wsAdapter);
  app.enableCors({
    origin: [process.env.CLIENT_URL, 'http://localhost:3001'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(
    session({
      secret: `COOKIE_SECRET`,
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000,
        sameSite: 'none',
        httpOnly: true,
      },
    }),
  );

  await app.listen(PORT, () => console.log(`Started on ${PORT}`));
}
bootstrap();
