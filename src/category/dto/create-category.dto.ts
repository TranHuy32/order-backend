export class CreateCategoryDto {
  constructor(
    public readonly name: string,
    public readonly cashier_id: string,
  ) {}
}
