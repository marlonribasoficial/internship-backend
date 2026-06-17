import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  nickname?: string;

  @Prop()
  email?: string;

  @Prop({ default: null })
  appleId?: string | null;

  @Prop({ default: null })
  googleId?: string | null;

  @Prop()
  birthDate?: Date;

  @Prop()
  photoUrl?: string;

  @Prop()
  bio?: string;

  @Prop()
  country?: string;

  @Prop({ default: false })
  isProfileComplete: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ nickname: 1 }, { unique: true, sparse: true });
UserSchema.index({ appleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export type UserDocument = HydratedDocument<User>;
