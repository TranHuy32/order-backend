import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupDocument } from './schema/group.schema';
import { GroupRepository } from './repository/group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: any,
  ): Promise<GroupDocument | string> {
    const owner_id = user.id;
    createGroupDto.owner_id = owner_id;
    const groupsExisted = await this.groupRepository.findObjectWithoutLimit();
    const filteredGroups = groupsExisted.filter(
      (group) => group.owner_id === owner_id,
    );
    if (filteredGroups) {
      const groupExisted = filteredGroups.filter(
        (group) => group.name === createGroupDto.name,
      );
      if (groupExisted.length !== 0) {
        return 'Group existed';
      }
    }
    return this.groupRepository.createObject(createGroupDto);
  }

  async findGroup(name: string): Promise<GroupDocument> {
    return this.groupRepository.findOneObject({ name });
  }

  async findGroupById(_id: string): Promise<GroupDocument> {
    return this.groupRepository.findOneObject({ _id });
  }

  async findAllGroups(): Promise<any> {
    const groups = await this.groupRepository.findObjectWithoutLimit();
    if (groups === null || groups.length === 0) {
      return 'No groups created';
    }
    return groups.map((group) => {
      return {
        _id: group._id,
        name: group.name,
        owner_id: group.owner_id,
      };
    });
  }

  async findAllGroupsByOwner(owner_id: string): Promise<any> {
    const groups = await this.groupRepository.findObjectWithoutLimit();
    const filteredGroups = groups.filter(
      (group) => group.owner_id === owner_id,
    );
    if (filteredGroups === null || filteredGroups.length === 0) {
      return 'No groups created';
    }
    return filteredGroups.map((group) => {
      return {
        _id: group._id,
        name: group.name,
        owner_id: group.owner_id,
      };
    });
  }

  async deleteGroup(id: string): Promise<any> {
    if (await this.groupRepository.deleteObjectById(id)) {
      return 'Successful delete';
    }
    return 'Invalid group';
  }
}
