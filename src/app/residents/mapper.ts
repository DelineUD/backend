import { UserModel } from '../users/models/user.model';
import { IResident } from './interfaces/resident.interface';

export const residentListMapper = (users: UserModel[]): IResident[] => {
  return users.map(residentMapper);
};

export const residentMapper = (user: UserModel): IResident => {
  return {
    avatar: user.avatar,

    qualification: user.qualification,

    badge: user.badge,

    instagram: user.instagram,
    telegram: user.telegram,

    about: user.about,

    portfolio_3dmax_visualization: user.portfolio_3dmax_visualization,

    portfolio_archicad: user.portfolio_archicad,

    portfolio_creative: user.portfolio_creative,
    portfolio_decorator: user.portfolio_decorator,
    portfolio_draftsman: user.portfolio_draftsman,
    portfolio_full_cycle_designer: user.portfolio_full_cycle_designer,
    portfolio_other: user.portfolio_other,
    portfolio_photoshop: user.portfolio_photoshop,
    portfolio_picker: user.portfolio_picker,
    portfolio_procreate: user.portfolio_procreate,
    portfolio_project_administrator: user.portfolio_project_administrator,
    portfolio_project_manager: user.portfolio_project_manager,
    portfolio_projector: user.portfolio_projector,
    portfolio_sketchup: user.portfolio_sketchup,
    portfolio_sketchup_dynamics: user.portfolio_sketchup_dynamics,
    portfolio_sketchup_visualization: user.portfolio_sketchup_visualization,
    portfolio_sketchup_volume: user.portfolio_sketchup_volume,
    portfolio_studio_manager: user.portfolio_studio_manager,
    phone: user.phone,
    email: user.email,

    specialization_construction_supervisor:
      user.specialization_construction_supervisor,
    specialization_creative_designer: user.specialization_creative_designer,
    specialization_equipment_specialist:
      user.specialization_equipment_specialist,
    specialization_general_practice_designer:
      user.specialization_general_practice_designer,
    specialization_project_curator: user.specialization_project_curator,
    specialization_project_management_assistant:
      user.specialization_project_management_assistant,
    specialization_project_manager: user.specialization_project_manager,
    specialization_studio_head: user.specialization_studio_head,
    specialization_visual_designer: user.specialization_visual_designer,
    searching_work_3dmax_visualization: user.searching_work_3dmax_visualization,
    searching_work_creative: user.searching_work_creative,
    searching_work_decorator: user.searching_work_decorator,
    searching_work_different: user.searching_work_different,
    searching_work_different_string: user.searching_work_different_string,
    searching_work_draftsman: user.searching_work_draftsman,
    searching_work_full_cycle_designer: user.searching_work_full_cycle_designer,
    searching_work_picker: user.searching_work_picker,
    searching_work_project_administrator:
      user.searching_work_project_administrator,
    searching_work_project_manager: user.searching_work_project_manager,
    searching_work_projector: user.searching_work_projector,
    searching_work_sketchup_dynamics: user.searching_work_sketchup_dynamics,
    searching_work_sketchup_visualization:
      user.searching_work_sketchup_visualization,
    searching_work_sketchup_volume: user.searching_work_sketchup_volume,
    searching_work_studio_manager: user.searching_work_studio_manager,

    programms_archicad: user.programms_archicad,
    programms_different: user.programms_different,
    programms_different_string: user.programms_different_string,
    programms_google: user.programms_google,
    programms_ms_office: user.programms_ms_office,
    programms_photoshop: user.programms_photoshop,
    programms_procreate: user.programms_procreate,
    programms_sketchup: user.programms_sketchup,
    programms_xmind: user.programms_xmind,
    programms_yandex: user.programms_yandex,

    cntry: user.cntry,

    birthday: user.birthday,

    service_cost: user.service_cost,

    distant_work: user.distant_work,

    work_now: user.work_now,

    _id: user._id,

    first_name: user.first_name,

    last_name: user.last_name,
  };
};
