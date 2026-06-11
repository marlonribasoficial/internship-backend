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
    EXPERIENCE = 'experience'
}

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Post {
    @Prop({ type: PostUserSchema, required: true })
    user: PostUser;

    @Prop({ type: LocationSchema, required: true })
    location: Location;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, enum: TypeTag }) // Ver se é uma opcão por post
    typeTag: TypeTag;

    @Prop({ min: 0, max: 5, validate: { validator: Number.isInteger } })
    rating?: number;

    @Prop({ type: [MediaSchema] })
    media?: Media[]; // Array de mídias associadas ao post

    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    showUserData: boolean;

    @Prop({ type: StatsSchema, default: () => ({ likes: 0, dislikes: 0, comments: 0, reports: 0 }) })
    stats: Stats;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ 'location.coordinates': '2dsphere' });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ typeTag: 1, createdAt: -1 });
PostSchema.index({ 'location.city': 1, 'location.country': 1 });
PostSchema.index({ 'location.placeId': 1, createdAt: -1 });
PostSchema.index({ 'user.id': 1, createdAt: -1 });