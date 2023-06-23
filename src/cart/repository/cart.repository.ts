import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { ImageService } from '../../image/image.service';
import { Cart, CartDocument } from '../schema/cart.schema';

export class CartRepository extends EntityRepository<CartDocument> {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    imageService: ImageService,
  ) {
    super(cartModel, imageService);
  }
}