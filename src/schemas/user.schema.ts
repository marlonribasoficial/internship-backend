import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ required: true, unique: true })
    email: string;

    // ids dos provedores OAuth — sparse porque só existem para usuários OAuth
    @Prop({ default: null, sparse: true })
    appleId: string;

    @Prop({ default: null, sparse: true })
    googleId: string;

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

// Adicionei índices para garantir unicidade e melhorar a performance das consultas por email, nickname e ids dos provedores OAuth
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nickname: 1 }, { unique: true });
UserSchema.index({ appleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });