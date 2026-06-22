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

  @Prop()
  hashedPassword?: string;

  @Prop({ type: String, default: null })
  appleId?: string | null;

  @Prop({ type: String, default: null })
  googleId?: string | null;

  @Prop()
  birthDate?: Date;

  @Prop()
  photoUrl?: string;

  @Prop()
  bio?: string;

  @Prop()
  country?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ nickname: 1 }, { unique: true, sparse: true });
UserSchema.index({ appleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.hashedPassword;
    delete obj.appleId;
    delete obj.googleId;
    delete obj.__v;
    return obj;
  },
});

export type UserDocument = HydratedDocument<User>;
