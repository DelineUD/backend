import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends Document implements IUser {
  @Prop({ required: true })
  phone: number;

  @Prop()
  password?: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  vpass?: number;

  @Prop()
  id?: string;
  @Prop()
  service_cost?: string;
  @Prop()
  gender?: string;
  @Prop()
  about?: string;
  @Prop()
  site?: string;
  @Prop()
  instagram?: string;
  @Prop()
  vk?: string;
  @Prop()
  telegram?: string;
  @Prop()
  portfolio?: string;
  @Prop()
  searching_work_full_cycle_designer?: string;
  @Prop()
  portfolio_full_cycle_designer?: string;
  @Prop()
  searching_work_projector?: string;
  @Prop()
  portfolio_projector?: string;
  @Prop()
  searching_work_creative?: string;
  @Prop()
  portfolio_creative?: string;
  @Prop()
  searching_work_decorator?: string;
  @Prop()
  portfolio_decorator?: string;
  @Prop()
  searching_work_draftsman?: string;
  @Prop()
  portfolio_draftsman?: string;
  @Prop()
  searching_work_sketchup_dynamics?: string;
  @Prop()
  portfolio_sketchup_dynamics?: string;
  @Prop()
  searching_work_sketchup_volume?: string;
  @Prop()
  portfolio_sketchup_volume?: string;
  @Prop()
  searching_work_sketchup_visualization?: string;
  @Prop()
  portfolio_sketchup_visualization?: string;
  @Prop()
  searching_work_3dmax_visualization?: string;
  @Prop()
  portfolio_3dmax_visualization?: string;
  @Prop()
  searching_work_picker?: string;
  @Prop()
  portfolio_picker?: string;
  @Prop()
  searching_work_project_manager?: string;
  @Prop()
  portfolio_project_manager?: string;
  @Prop()
  searching_work_project_administrator?: string;
  @Prop()
  portfolio_project_administrator?: string;
  @Prop()
  searching_work_studio_manager?: string;
  @Prop()
  portfolio_studio_manager?: string;
  @Prop()
  searching_work_different?: string;
  @Prop()
  searching_work_different_string?: string;
  @Prop()
  portfolio_other?: string;
  @Prop()
  programms_sketchup?: string;
  @Prop()
  portfolio_sketchup?: string;
  @Prop()
  programms_photoshop?: string;
  @Prop()
  portfolio_photoshop?: string;
  @Prop()
  programms_procreate?: string;
  @Prop()
  portfolio_procreate?: string;
  @Prop()
  programms_archicad?: string;
  @Prop()
  portfolio_archicad?: string;
  @Prop()
  programms_google?: string;
  @Prop()
  programms_yandex?: string;
  @Prop()
  programms_xmind?: string;
  @Prop()
  programms_ms_office?: string;
  @Prop()
  programms_different?: string;
  @Prop()
  programms_different_string?: string;
  @Prop()
  work_now?: string;
  @Prop()
  qualification?: string;
  @Prop()
  distant_work?: string;
  @Prop()
  first_name?: string;
  @Prop()
  last_name?: string;
  @Prop()
  hide_phone?: string;
  @Prop()
  badge?: string;
  @Prop()
  role?: string;
  @Prop()
  birthday?: string;
  @Prop()
  qualification_color?: string;
  @Prop()
  specialization?: string;
  @Prop()
  specialization_general_practice_designer?: string;
  @Prop()
  specialization_designer_designer?: string;
  @Prop()
  specialization_designer_technologist?: string;
  @Prop()
  specialization_creative_designer?: string;
  @Prop()
  specialization_visual_designer?: string;
  @Prop()
  specialization_studio_head?: string;
  @Prop()
  specialization_project_curator?: string;
  @Prop()
  specialization_project_management_assistant?: string;
  @Prop()
  specialization_project_manager?: string;
  @Prop()
  specialization_equipment_specialist?: string;
  @Prop()
  specialization_construction_supervisor?: string;
  @Prop()
  cntry?: string;
  @Prop()
  city_ru?: string;
  @Prop()
  citynru?: string;
  @Prop()
  status?: string;
  @Prop()
  api_city?: string;
  @Prop()
  position_tag?: string;
  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
