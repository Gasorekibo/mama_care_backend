import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/dist/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local-strategy';
import { JwtStrategy } from './strategy/jwt-strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, HealthcareFacility]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION_TIME')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthenticationModule {}
