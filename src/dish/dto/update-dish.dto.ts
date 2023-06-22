import { CreateImageDetailDto } from './create-image-detail.dto';

export class UpdateDishDto {
  image_detail: CreateImageDetailDto;
  name: string;
  price: number;
  description: string;
  category: string;
}
