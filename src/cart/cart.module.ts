import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { ImageModule } from 'src/image/image.module';
import { CartController } from './cart.controller';
import { CartRepository } from './repository/cart.repository';
import { CartService } from './cart.service';
import { DishModule } from 'src/dish/dish.module';
import { TableModule } from 'src/table/table.module';
import { EventsModule } from 'src/events/events.module';
import { GroupModule } from 'src/group/group.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CallStaffModule } from 'src/call-staff/call-staff.module';
import { CashierModule } from 'src/cashier/cashier.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file 5MB
      },
    }),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ImageModule,
    DishModule,
    TableModule,
    EventsModule,
    GroupModule,
    CallStaffModule,
    CashierModule
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}
