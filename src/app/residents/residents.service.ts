import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { residentListMapper } from './mapper';

@Injectable()
export class ResidentsService {
  constructor(private usersService: UsersService) {}

  async getResidentsList(): Promise<IResident[]> {
    return this.usersService.getUsers().then(residentListMapper);
  }

  async getResidentById(query: GetResidentParamsDto): Promise<any> {
    const unit = await this.usersService.findOne(query);
    return {
      _id: unit._id,

      first_name: unit.first_name,

      last_name: unit.last_name,

      avatar: unit.avatar,

      qualification: unit.qualification,

      badge: unit.badge,

      about: unit.about,

      description_fields: [
        {
          field: 'Портфолио',
          items: [
            {
              name: 'Визуализация в 3D MAX',
              link: unit.portfolio_3dmax_visualization,
            },
            {
              name: 'Архикад',
              link: unit.portfolio_archicad,
            },
            {
              name: 'Креатив',
              link: unit.portfolio_creative,
            },
            {
              name: 'Декоратор',
              link: unit.portfolio_decorator,
            },
            {
              name: 'Чертежи',
              link: unit.portfolio_draftsman,
            },
            {
              name: 'Полный цикл',
              link: unit.portfolio_full_cycle_designer,
            },
            {
              name: 'Разное',
              link: unit.portfolio_other,
            },
            {
              name: 'Фотошоп',
              link: unit.portfolio_photoshop,
            },
            {
              name: 'Фотошоп',
              link: unit.portfolio_picker,
            },
            {
              name: 'Procreate',
              link: unit.portfolio_procreate,
            },
            {
              name: 'Администратор проекта',
              link: unit.portfolio_project_administrator,
            },
            {
              name: 'Менеджер проекта',
              link: unit.portfolio_project_manager,
            },
            {
              name: 'Портфолио проджект',
              link: unit.portfolio_projector,
            },
            {
              name: 'Портфолио sketchup',
              link: unit.portfolio_sketchup,
            },
            {
              name: 'Sketchup динамичевкие сцены ',
              link: unit.portfolio_sketchup_dynamics,
            },
            {
              name: 'Sketchup визуализация ',
              link: unit.portfolio_sketchup_visualization,
            },
            {
              name: 'Sketchup звук ',
              link: unit.portfolio_sketchup_volume,
            },
            {
              name: 'Sketchup звук ',
              link: unit.portfolio_studio_manager,
            },
          ],
        },
        {
          field: 'Контактная информация',
          items: [
            {
              label: 'Телефон',
              value: unit.phone,
            },
            {
              label: 'Email',
              value: unit.email,
            },
          ],
        },
        {
          field: 'Специализация',
          items: [
            unit.specialization_construction_supervisor,
            unit.specialization_creative_designer,
            unit.specialization_equipment_specialist,
            unit.specialization_general_practice_designer,
            unit.specialization_project_curator,
            unit.specialization_project_management_assistant,
            unit.specialization_project_manager,
            unit.specialization_studio_head,
            unit.specialization_visual_designer,
          ],
        },
        {
          field: 'Ищу работу',
          items: [
            unit.searching_work_3dmax_visualization,
            unit.searching_work_creative,
            unit.searching_work_decorator,
            unit.searching_work_different,
            unit.searching_work_different_string,
            unit.searching_work_draftsman,
            unit.searching_work_full_cycle_designer,
            unit.searching_work_picker,
            unit.searching_work_project_administrator,
            unit.searching_work_project_manager,
            unit.searching_work_projector,
            unit.searching_work_sketchup_dynamics,
            unit.searching_work_sketchup_visualization,
            unit.searching_work_sketchup_volume,
            unit.searching_work_studio_manager,
          ],
        },
        {
          field: 'Владение программами',
          items: [
            unit.programms_archicad,
            unit.programms_different,
            unit.programms_different_string,
            unit.programms_google,
            unit.programms_ms_office,
            unit.programms_photoshop,
            unit.programms_procreate,
            unit.programms_sketchup,
            unit.programms_xmind,
            unit.programms_yandex,
          ],
        },
        {
          field: 'Информация',
          items: [
            {
              label: 'Местоположение',
              value: unit.cntry + ' ' + unit.api_city,
            },
            {
              label: 'Возраст',
              value: unit.birthday,
            },
            {
              label: 'Стоимость услуг',
              value: unit.service_cost,
            },
            {
              label: 'Готовность к удаленной работе',
              value: unit.distant_work,
            },
            {
              label: 'Готовность к работе прямо сейчас',
              value: unit.work_now,
            },
          ],
        },
      ],
    };
  }
}
