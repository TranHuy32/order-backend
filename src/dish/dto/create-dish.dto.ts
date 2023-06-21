import { CreateImageDetailDto } from './create-image-detail.dto';

export class CreateDishDto {
  image_detail: CreateImageDetailDto;
  name: string;
  description: string;
  categories: string[];
  createAt: string;
}
