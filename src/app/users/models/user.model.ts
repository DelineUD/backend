import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends Document implements IUser {
  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  vpass?: number;

  /** квалификация */
  @Prop()
  quality: string;

  /** ссылка на инстаграм */
  @Prop()
  instagram: string;

  /** ссылка на вк */
  @Prop()
  vk: string;

  /** о себе */
  @Prop()
  bio: string;

  /** город */
  @Prop()
  city: string;

  /** возраст */
  @Prop()
  age: number;

  /** Стоимость услуг */
  @Prop()
  price: string;

  /** Готовность к удаленной работе */
  @Prop()
  readyToRemote: boolean;

  /** Готовность к работе прямо сейчас */
  @Prop()
  readyToWorkNow: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
