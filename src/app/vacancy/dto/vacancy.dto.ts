import { Types } from 'mongoose';
import { IsBooleanString, IsNumber, IsOptional, IsString } from 'class-validator';

import { AuthorStatus } from '../consts';
import { IUser } from '../../users/interfaces/user.interface';

export class VacancyDto {
  // Personal information
  @IsString() readonly id: string;
  @IsString() readonly title: string;
  @IsOptional() @IsString() readonly description?: string;
  @IsBooleanString() readonly remote: boolean;
  @IsString() readonly status: AuthorStatus;
  @IsOptional() @IsString() readonly city?: string;
  @IsOptional() @IsString() readonly gender?: string;
  @IsOptional() @IsNumber() readonly minCost?: number;
  @IsOptional() @IsNumber() readonly maxCost?: number;

  // Share information
  @IsString() readonly feedbackLink: string;
  readonly author: string | Types.ObjectId | IUser;

  // Specializations
  @IsOptional() @IsString() readonly specialization_creative_designer?: string;
  @IsOptional() @IsString() readonly specialization_general_practice_designer?: string;
  @IsOptional() @IsString() readonly specialization_full_cycle_designer?: string;
  @IsOptional() @IsString() readonly specialization_decorator?: string;
  @IsOptional() @IsString() readonly specialization_complect?: string;
  @IsOptional() @IsString() readonly specialization_author_control?: string;
  @IsOptional() @IsString() readonly specialization_project_manager?: string;
  @IsOptional() @IsString() readonly specialization_project_owner?: string;
  @IsOptional() @IsString() readonly specialization_studio_owner?: string;
  @IsOptional() @IsString() readonly specialization_assist?: string;
  @IsOptional() @IsString() readonly specialization_sketchup?: string;
  @IsOptional() @IsString() readonly specialization_sketch_model?: string;
  @IsOptional() @IsString() readonly specialization_enscape?: string;
  @IsOptional() @IsString() readonly specialization_sketch_mebel?: string;
  @IsOptional() @IsString() readonly specialization_enscape_viz?: string;
  @IsOptional() @IsString() readonly specialization_3dmax_viz?: string;
  @IsOptional() @IsString() readonly specialization_plan_autocad?: string;
  @IsOptional() @IsString() readonly specialization_plan_arch?: string;
  @IsOptional() @IsString() readonly specialization_plan_revit?: string;
  @IsOptional() @IsString() readonly specialization_measurement?: string;

  // Narrow specializations
  @IsOptional() @IsString() readonly narrow_spec_measurement?: string;
  @IsOptional() @IsString() readonly narrow_spec_measurement_create?: string;
  @IsOptional() @IsString() readonly narrow_spec_anket_tz?: string;
  @IsOptional() @IsString() readonly narrow_spec_plan_plane?: string;
  @IsOptional() @IsString() readonly narrow_spec_sketch_white?: string;
  @IsOptional() @IsString() readonly narrow_spec_concept?: string;
  @IsOptional() @IsString() readonly narrow_spec_sketch_volume?: string;
  @IsOptional() @IsString() readonly narrow_spec_viz_sketch?: string;
  @IsOptional() @IsString() readonly narrow_spec_viz_3dmax?: string;
  @IsOptional() @IsString() readonly narrow_spec_viz_other?: string;
  @IsOptional() @IsString() readonly narrow_spec_viz_enscape?: string;
  @IsOptional() @IsString() readonly narrow_spec_viz_create_schem_viz?: string;
  @IsOptional() @IsString() readonly narrow_spec_pccp?: string;
  @IsOptional() @IsString() readonly narrow_spec_sop_compl?: string;
  @IsOptional() @IsString() readonly narrow_spec_author_spec?: string;
  @IsOptional() @IsString() readonly narrow_spec_release_cpec?: string;
  @IsOptional() @IsString() readonly narrow_spec_project_manager?: string;
  @IsOptional() @IsString() readonly narrow_spec_project_owner?: string;
  @IsOptional() @IsString() readonly narrow_spec_studio_owner?: string;
  @IsOptional() @IsString() readonly narrow_spec_cmm_diz?: string;
  @IsOptional() @IsString() readonly narrow_spec_reels_maker?: string;
  @IsOptional() @IsString() readonly narrow_spec_diz_assist?: string;
  @IsOptional() @IsString() readonly narrow_spec_office_manager?: string;
  @IsOptional() @IsString() readonly narrow_spec_graph_diz?: string;

  // Programs
  @IsOptional() @IsString() readonly programs_sketchup?: string;
  @IsOptional() @IsString() readonly programs_enscape?: string;
  @IsOptional() @IsString() readonly programs_lumen?: string;
  @IsOptional() @IsString() readonly programs_autocad?: string;
  @IsOptional() @IsString() readonly programs_archicad?: string;
  @IsOptional() @IsString() readonly programs_revit?: string;
  @IsOptional() @IsString() readonly programs_3dmax?: string;

  // Courses
  @IsOptional() @IsString() readonly coursed_masstart?: string;
  @IsOptional() @IsString() readonly coursed_prof?: string;
  @IsOptional() @IsString() readonly coursed_build?: string;
  @IsOptional() @IsString() readonly coursed_sketchup?: string;
  @IsOptional() @IsString() readonly coursed_dnd?: string;
}
