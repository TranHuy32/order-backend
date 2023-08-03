import { Module } from '@nestjs/common';
import { CashierService } from './cashier.service';
import { CashierController } from './cashier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from 'src/image/image.module';
import { Cashier, CashierSchema } from './schema/cashier.schema';
import { CashierRepository } from './repository/cashier.repository';
import { CashierAuthModule } from 'src/auth/cashier-auth/cashier.auth.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cashier.name, schema: CashierSchema }]),
    ImageModule,
    EventsModule,
  ],
  providers: [CashierService, CashierRepository],
  controllers: [CashierController],
  exports: [CashierService, CashierRepository],
})
export class CashierModule {}
