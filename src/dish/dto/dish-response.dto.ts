import { ImageResponse } from 'src/image/dto/image-response.dto';

export class DishResponse {
  _id: string;
  image_detail: ImageResponse;
  name: string;
  price: number;
  category: string[];
  description: string;
  createAt: string;
  updateAt: string;
  isActive: boolean;
  isBestSeller: boolean;
  options: string[]
  constructor(dish: any, dishPath: any) {
    this._id = dish._id;
    this.name = dish.name;
    this.price = dish.price;
    this.category = dish.category;
    this.description = dish.description;
    this.image_detail = dishPath.image_detail;
    this.createAt = dish.createAt;
    this.updateAt = dish.updateAt;
    this.isActive = dish.isActive;
    this.isBestSeller = dishPath.isBestSeller;
    this.options = dishPath.options;
  }
}
