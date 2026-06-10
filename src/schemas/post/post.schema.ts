import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Location, LocationSchema } from './location.schema';
import { Media, MediaSchema } from './media.schema';
import { Stats, StatsSchema } from './stats.schema';
import { PostUser, PostUserSchema } from './postuser.schema';

export enum TypeTag {
    TIP = 'tip',
    WARNING = 'warning',
    REVIEW = 'review',
    QUESTION = 'question',
    EXPERIENCE = 'experience',
}

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: PostUserSchema, required: true })
    user: PostUser;

    @Prop({ type: LocationSchema, required: true })
    location: Location;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, enum: TypeTag }) // Ver se é uma opcão por post
    typeTag: TypeTag;

    @Prop({ required: true, min: 0, max: 5 })
    rating: number; // Ver se ser de 0 a 5 mesmo

    @Prop({ type: [MediaSchema], default: [] })
    media: Media[]; // Array de mídias associadas ao post

    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    showUserData: boolean;

    @Prop({ type: StatsSchema, default: () => ({ likes: 0, dislikes: 0, comments: 0, reports: 0 }) })
    stats: Stats;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ 'location.coordinates': '2dsphere' }); // oq eh isso