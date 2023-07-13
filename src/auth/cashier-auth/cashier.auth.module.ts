import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CashierModule } from 'src/cashier/cashier.module';
import { CashierAuthController } from './cashier.auth.controller';
import { CashierJwtStrategy } from './strategies/jwt.strategy';
import { CashierAuthService } from './cashier.auth.service';

@Module({
  imports: [
    CashierModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CashierAuthController],
  providers: [CashierAuthService, CashierJwtStrategy],
})
export class CashierAuthModule {}