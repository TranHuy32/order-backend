export class CreateGroupDto {
  constructor(public readonly name: string, public owner_id?: string) {}
}
