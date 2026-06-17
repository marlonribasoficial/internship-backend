import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuthProfile } from '../auth/interfaces/oauth-profile.interface';
import { User, UserDocument } from '../schemas/user.schema';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByAppleId(appleId: string) {
    return this.userModel.findOne({ appleId });
  }

  async findByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId });
  }

  async findOrCreateOAuthUser(profile: OAuthProfile): Promise<UserDocument> {
    let user: UserDocument | null = null;

    if (profile.appleId) {
      user = await this.findByAppleId(profile.appleId);
    } else if (profile.googleId) {
      user = await this.findByGoogleId(profile.googleId);
    }

    if (user) {
      if (profile.email && !user.email) {
        user.email = profile.email;
        await user.save();
      }
      return user;
    }

    return this.userModel.create({
      name: profile.name,
      email: profile.email,
      appleId: profile.appleId ?? null,
      googleId: profile.googleId ?? null,
      photoUrl: profile.photoUrl,
      isProfileComplete: false,
    });
  }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { ...dto, isProfileComplete: true },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  getUsers() {
    return this.userModel.find();
  }

  getUsersById(id: string) {
    return this.userModel.findById(id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
