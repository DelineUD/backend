import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UserDto {
  _id?: Types.ObjectId;

  // Personal Information
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: number;
  @IsOptional() @IsString() id?: string;
  @IsOptional()
  @IsString()
  password?: string;
  @IsOptional()
  @IsNumber()
  vPass?: number;
  @IsOptional()
  @IsString()
  first_name?: string;
  @IsOptional()
  @IsString()
  last_name?: string;
  @IsOptional()
  @IsDate()
  birthday?: Date;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsString()
  cntry?: string;

  // Contact Information
  @IsOptional()
  @IsString()
  city_ru?: string;
  @IsOptional()
  @IsString()
  citynru?: string;

  // Additional Information
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  education?: string;

  // Social Media
  @IsOptional()
  @IsNumber()
  service_cost?: number;
  @IsOptional()
  @IsString()
  site?: string;
  @IsOptional()
  @IsString()
  instagram?: string;
  @IsOptional()
  @IsString()
  telegram?: string;
  @IsOptional() @IsString() vk?: string;

  // Preferences
  @IsOptional()
  @IsBoolean()
  hide_phone?: boolean;
  @IsOptional()
  @IsString()
  qualification_color?: string;

  // Programs
  @IsOptional()
  @IsString()
  programms_sketchup?: string;
  @IsOptional()
  @IsString()
  programms_enscape?: string;
  @IsOptional()
  @IsString()
  programms_lumen?: string;
  @IsOptional()
  @IsString()
  programms_autocad?: string;
  @IsOptional()
  @IsString()
  programms_archicad?: string;
  @IsOptional()
  @IsString()
  programms_revit?: string;
  @IsOptional()
  @IsString()
  programms_3dmax?: string;

  // Courses
  @IsOptional()
  @IsString()
  courseud_masstart?: string;
  @IsOptional()
  @IsString()
  courseud_prof?: string;
  @IsOptional()
  @IsString()
  courseud_build?: string;
  @IsOptional()
  @IsString()
  courseud_sketchup?: string;
  @IsOptional()
  @IsString()
  courseud_dnd?: string;

  // Status and Specializations
  @IsOptional()
  @IsString()
  status?: string;
  @IsOptional()
  @IsString()
  specialization_creative_designer?: string;
  @IsOptional()
  @IsString()
  specialization_general_practice_designer?: string;
  @IsOptional()
  @IsString()
  specialization_full_cycle_designer?: string;
  @IsOptional()
  @IsString()
  specialization_decorator?: string;
  @IsOptional()
  @IsString()
  specialization_complect?: string;
  @IsOptional()
  @IsString()
  specialization_author_control?: string;
  @IsOptional()
  @IsString()
  specialization_project_manager?: string;
  @IsOptional()
  @IsString()
  specialization_project_owner?: string;
  @IsOptional()
  @IsString()
  specialization_studio_owner?: string;
  @IsOptional()
  @IsString()
  specialization_assist?: string;
  @IsOptional()
  @IsString()
  specialization_sketchup?: string;
  @IsOptional()
  @IsString()
  specialization_sketch_model?: string;
  @IsOptional()
  @IsString()
  specialization_enscape?: string;
  @IsOptional()
  @IsString()
  specialization_sketch_mebel?: string;
  @IsOptional()
  @IsString()
  specialization_enscape_viz?: string;
  @IsOptional()
  @IsString()
  specialization_3dmax_viz?: string;
  @IsOptional()
  @IsString()
  specialization_plan_autocad?: string;
  @IsOptional()
  @IsString()
  specialization_plan_arch?: string;
  @IsOptional()
  @IsString()
  specialization_plan_revit?: string;
  @IsOptional()
  @IsString()
  specialization_measurement?: string;

  // Narrow Specializations
  @IsOptional()
  @IsString()
  narrow_spec_measurement?: string;
  @IsOptional()
  @IsString()
  narrow_spec_measurement_create?: string;
  @IsOptional()
  @IsString()
  narrow_spec_anket_tz?: string;
  @IsOptional()
  @IsString()
  narrow_spec_plan_plane?: string;
  @IsOptional()
  @IsString()
  narrow_spec_sketch_white?: string;
  @IsOptional()
  @IsString()
  narrow_spec_concept?: string;
  @IsOptional()
  @IsString()
  narrow_spec_sketch_volume?: string;
  @IsOptional()
  @IsString()
  narrow_spec_viz_sketch?: string;
  @IsOptional()
  @IsString()
  narrow_spec_viz_3dmax?: string;
  @IsOptional()
  @IsString()
  narrow_spec_viz_other?: string;
  @IsOptional()
  @IsString()
  narrow_spec_viz_enscape?: string;
  @IsOptional()
  @IsString()
  narrow_spec_viz_create_schem_viz?: string;
  @IsOptional()
  @IsString()
  narrow_spec_pccp?: string;
  @IsOptional()
  @IsString()
  narrow_spec_sop_compl?: string;
  @IsOptional()
  @IsString()
  narrow_spec_author_spec?: string;
  @IsOptional()
  @IsString()
  narrow_spec_release_cpec?: string;
  @IsOptional()
  @IsString()
  narrow_spec_project_manager?: string;
  @IsOptional()
  @IsString()
  narrow_spec_project_owner?: string;
  @IsOptional()
  @IsString()
  narrow_spec_studio_owner?: string;
  @IsOptional()
  @IsString()
  narrow_spec_cmm_diz?: string;
  @IsOptional()
  @IsString()
  narrow_spec_reels_maker?: string;
  @IsOptional()
  @IsString()
  narrow_spec_diz_assist?: string;
  @IsOptional()
  @IsString()
  narrow_spec_office_manager?: string;
  @IsOptional()
  @IsString()
  narrow_spec_graph_diz?: string;
}
