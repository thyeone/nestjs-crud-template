import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { validate } from './utils/env.validation';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from './auth/token.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    TokenModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    BoardsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    AuthModule,
  ],
})
export class AppModule {}
