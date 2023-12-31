import { Module } from '@nestjs/common';
import { CallStaffController } from './call-staff.controller';
import { CallStaffService } from './call-staff.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CallStaff, CallStaffSchema } from './schema/call-staff.schema';
import { TableModule } from 'src/table/table.module';
import { CallStaffRepository } from './repository/call-staff.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallStaff.name, schema: CallStaffSchema },
    ]),
    TableModule,
  ],
  controllers: [CallStaffController],
  providers: [CallStaffService, CallStaffRepository],
})
export class CallStaffModule {}
