import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { MapDto } from './dto/map.dto';

@Injectable()
export class MapService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPinsInRegion(query: MapDto) {
    return this.postModel.aggregate([
      {
        // 1. Acha todos os posts dentro da "Caixa" da tela do celular
        $match: {
          'location.coordinates.coordinates': {
            $geoWithin: {
              $box: [
                [query.minLon, query.minLat],
                [query.maxLon, query.maxLat]
              ]
            }
          }
        }
      },
      {
        // 2. Agrupa os posts que têm o mesmo placeId
        $group: {
          _id: '$location.placeId',
          name: { $first: '$location.name' },
          coordinates: { $first: '$location.coordinates.coordinates' },
          postCount: { $sum: 1 } // Conta quantos posts caíram nesse grupo
        }
      },
      {
        // 3. Limpa a saída para o SwiftUI receber um JSON bonito
        $project: {
          placeId: '$_id',
          name: 1,
          coordinates: 1,
          postCount: 1,
          _id: 0
        }
      }
    ]).exec();
  }
}