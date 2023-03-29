import { IsEmail, IsNotEmpty } from 'class-validator';
//import { TaskDto } from '../../tasks/dto/task.dto';

export class UserDto {
  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  email: string;

  vpass?: number;

id?: string;

service_cost?: string;

gender?: string;

about?: string;

site?: string;

instagram?: string;

vk?: string;

telegram?: string;

portfolio?: string;

searching_work_full_cycle_designer?: string;

portfolio_full_cycle_designer?: string;

searching_work_projector?: string;

portfolio_projector?: string;

searching_work_creative?: string;

portfolio_creative?: string;

searching_work_decorator?: string;

portfolio_decorator?: string;

searching_work_draftsman?: string;

portfolio_draftsman?:string;

searching_work_sketchup_dynamics?: string;

portfolio_sketchup_dynamics?: string;

searching_work_sketchup_volume?: string;

portfolio_sketchup_volume?: string;

searching_work_sketchup_visualization?: string;

portfolio_sketchup_visualization?: string;

searching_work_3dmax_visualization?: string;

portfolio_3dmax_visualization?: string;

searching_work_picker?: string;

portfolio_picker?: string;

searching_work_project_manager?: string;

portfolio_project_manager?: string;

searching_work_project_administrator?: string;

portfolio_project_administrator?:string;

searching_work_studio_manager?: string;
portfolio_studio_manager?: string;

searching_work_different?: string;

searching_work_different_string?: string;

portfolio_other?: string;

programms_sketchup?: string;

portfolio_sketchup?: string;

programms_photoshop?: string;

portfolio_photoshop?: string;

programms_procreate?: string;

portfolio_procreate?: string;

programms_archicad?: string;

portfolio_archicad?: string;

programms_google?: string;

programms_yandex?: string;

programms_xmind?: string;

programms_ms_office?: string;

programms_different?: string;

programms_different_string?: string;

work_now?: string;

qualification?: string;

distant_work?: string;

first_name?: string;

last_name?: string;

hide_phone?: string;

badge?: string;

role?: string;

birthday?: string;

qualification_color?: string;

specialization?: string;

specialization_general_practice_designer?: string;

specialization_designer_designer?: string;

specialization_designer_technologist?: string;

specialization_creative_designer?: string;

specialization_visual_designer?: string;

specialization_studio_head?: string;

specialization_project_curator?: string;

specialization_project_management_assistant?: string;

specialization_project_manager?: string;

specialization_equipment_specialist?: string;

specialization_construction_supervisor?: string;

cntry?: string;

city_ru?: string;

citynru?: string;

status?: string;

api_city?: string;

position_tag?: string;

}
