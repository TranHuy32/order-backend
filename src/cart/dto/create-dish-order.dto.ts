export class CreateDishOrderDto {
    constructor(
      public dish_id: string,
      public number: string,
      public option: string[],
    ) {}
  }