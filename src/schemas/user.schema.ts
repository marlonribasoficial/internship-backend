import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    hashedPassword: string;

    @Prop({ default: null })
    birthDate: Date;

    @Prop({ default: null })
    photoUrl: string;

    @Prop({ default: null })
    bio: string;

    @Prop({ default: null })
    country: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nickname: 1 }, { unique: true });