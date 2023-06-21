import { ImageResponse } from 'src/image/dto/image-response.dto';

export class DishResponse {
  _id: string;
  image_detail: ImageResponse;
  name: string;
  categories: string[];
  description: string;
  createAt: string;

  constructor(dish: any, dishPath: any) {
    this._id = dish._id;
    this.name = dish.name;
    this.categories = dish.categories;
    this.description = dish.description;
    this.image_detail = dishPath.image_detail;
    this.createAt = dishPath.createAt;
  }
}
