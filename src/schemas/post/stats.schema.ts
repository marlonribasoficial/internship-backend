import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Stats {
    @Prop({ required: true })
    likes: number;

    @Prop({ required: true })
    dislikes: number;

    @Prop({ required: true })
    comments: number;

    @Prop({ required: true })
    reports: number;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);