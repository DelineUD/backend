import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel extends Document implements IUser {
  // Personal Information
  @Prop() id?: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phone: number;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  first_name: string;
  @Prop({ required: true })
  last_name: string;
  @Prop() birthday?: Date;
  @Prop() avatar?: string;
  @Prop() gender?: string;
  @Prop() vPass?: number;
  @Prop() cntry?: string;

  // Contact Information
  @Prop() city_ru?: string;
  @Prop() citynru?: string;

  // Additional Information
  @Prop() about?: string;
  @Prop() education?: string;

  // Social Media
  @Prop() service_cost?: number;
  @Prop() site?: string;
  @Prop() instagram?: string;
  @Prop() telegram?: string;
  @Prop() vk?: string;

  // Preferences
  @Prop() hide_phone?: boolean;
  @Prop() qualification_color?: string;

  // Programs
  @Prop() programms_sketchup?: string;
  @Prop() programms_enscape?: string;
  @Prop() programms_lumen?: string;
  @Prop() programms_autocad?: string;
  @Prop() programms_archicad?: string;
  @Prop() programms_revit?: string;
  @Prop() programms_3dmax?: string;

  // Courses
  @Prop() courseud_masstart?: string;
  @Prop() courseud_prof?: string;
  @Prop() courseud_build?: string;
  @Prop() courseud_sketchup?: string;
  @Prop() courseud_dnd?: string;

  // Status and Specializations
  @Prop() status?: string;
  @Prop()
  specialization_creative_designer?: string;
  @Prop()
  specialization_general_practice_designer?: string;
  @Prop()
  specialization_full_cycle_designer?: string;
  @Prop()
  specialization_decorator?: string;
  @Prop()
  specialization_complect?: string;
  @Prop()
  specialization_author_control?: string;
  @Prop()
  specialization_project_manager?: string;
  @Prop()
  specialization_project_owner?: string;
  @Prop()
  specialization_studio_owner?: string;
  @Prop()
  specialization_assist?: string;
  @Prop()
  specialization_sketchup?: string;
  @Prop()
  specialization_sketch_model?: string;
  @Prop()
  specialization_enscape?: string;
  @Prop()
  specialization_sketch_mebel?: string;
  @Prop()
  specialization_enscape_viz?: string;
  @Prop()
  specialization_3dmax_viz?: string;
  @Prop()
  specialization_plan_autocad?: string;
  @Prop()
  specialization_plan_arch?: string;
  @Prop()
  specialization_plan_revit?: string;
  @Prop()
  specialization_measurement?: string;

  // Narrow Specializations
  @Prop()
  narrow_spec_measurement?: string;
  @Prop()
  narrow_spec_measurement_create?: string;
  @Prop() narrow_spec_anket_tz?: string;
  @Prop()
  narrow_spec_plan_plane?: string;
  @Prop()
  narrow_spec_sketch_white?: string;
  @Prop() narrow_spec_concept?: string;
  @Prop()
  narrow_spec_sketch_volume?: string;
  @Prop()
  narrow_spec_viz_sketch?: string;
  @Prop()
  narrow_spec_viz_3dmax?: string;
  @Prop()
  narrow_spec_viz_other?: string;
  @Prop()
  narrow_spec_viz_enscape?: string;
  @Prop()
  narrow_spec_viz_create_schem_viz?: string;
  @Prop() narrow_spec_pccp?: string;
  @Prop()
  narrow_spec_sop_compl?: string;
  @Prop()
  narrow_spec_author_spec?: string;
  @Prop()
  narrow_spec_release_cpec?: string;
  @Prop()
  narrow_spec_project_manager?: string;
  @Prop()
  narrow_spec_project_owner?: string;
  @Prop()
  narrow_spec_studio_owner?: string;
  @Prop() narrow_spec_cmm_diz?: string;
  @Prop()
  narrow_spec_reels_maker?: string;
  @Prop()
  narrow_spec_diz_assist?: string;
  @Prop()
  narrow_spec_office_manager?: string;
  @Prop()
  narrow_spec_graph_diz?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
