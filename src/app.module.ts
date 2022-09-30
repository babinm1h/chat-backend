import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { PassportModule } from '@nestjs/passport';
import { DialogsModule } from './dialogs/dialogs.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UsersModule,
    DialogsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
