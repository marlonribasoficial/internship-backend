import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Coordinates, CoordinatesSchema } from './coordinates.schema';

@Schema({ _id: false })
export class Location {
    @Prop({ required: true })
    placeId: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    country: string;

    @Prop()
    address: string;

    @Prop({ type: CoordinatesSchema, required: true})
    coordinates: Coordinates;
}

export const LocationSchema = SchemaFactory.createForClass(Location);