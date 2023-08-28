import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CashierAuthGuard } from 'src/auth/cashier-auth/guards/auth.guard';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupDocument } from './schema/group.schema';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(CashierAuthGuard)
  @Post('create')
  async createCallStaffByCashier(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: any,
  ): Promise<GroupDocument | string> {
    const owner = req.user;
    return this.groupService.createGroup(createGroupDto, owner);
  }

  // all group
  @Get('/all')
  async allGroup() {
    return this.groupService.findAllGroups(); 
  }

  @UseGuards(CashierAuthGuard)
  @Get('/allByOwner')
  async allGroupByOwner(@Req() req: any) {
    const owner = req.user;
    return this.groupService.findAllGroupsByOwner(owner.id);
  }

  @UseGuards(CashierAuthGuard)
  @Delete('delete/:id')
  async deleteGroup(@Param('id') id: string) {
    return this.groupService.deleteGroup(id);
  }
}
