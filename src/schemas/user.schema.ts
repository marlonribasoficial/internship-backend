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

    @Prop({ required: true })
    birthDate: Date;

    @Prop()
    photoUrl?: string;

    @Prop()
    bio?: string;

    @Prop({ required: true })
    country: string;
}

export const UserSchema = SchemaFactory.createForClass(User);