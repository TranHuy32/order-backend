import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "./schema/group.schema";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { GroupRepository } from "./repository/group.repository";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  providers: [GroupService, GroupRepository],
  exports: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
