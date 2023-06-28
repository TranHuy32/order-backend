export class CreateDishOrderDto {
    constructor(
      public dish_id: string,
      public number: number,
      public options: string[],
    ) {}
  }