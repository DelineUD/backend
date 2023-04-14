import { UserModel } from '../users/models/user.model';
import { IResidentList } from './interfaces/resident.interface-list';

export const residentListMapper = (user: UserModel[]): IResidentList[] => {
  return user.map(residenstMapper);
};

export const residenstMapper = (user: UserModel): IResidentList => {
  return {
    _id: user._id,
    avatar: user.avatar,
    qualification: user.qualification,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

export const residentMapper = (user: UserModel): any => {
  return {
    _id: user._id,

    first_name: user.first_name,

    last_name: user.last_name,

    avatar: user.avatar,

    qualification: user.qualification,

    badge: user.badge,

    about: user.about,

    description_fields: [
      {
        field: 'Портфолио',
        items: [
          ...(user.portfolio_3dmax_visualization
            ? [
                {
                  name: 'имя',
                  link: user.portfolio_3dmax_visualization,
                },
              ]
            : []),

          {
            name: 'Архикад',
            link: user.portfolio_archicad,
          },
          {
            name: 'Креатив',
            link: user.portfolio_creative,
          },
          {
            name: 'Декоратор',
            link: user.portfolio_decorator,
          },
          {
            name: 'Чертежи',
            link: user.portfolio_draftsman,
          },
          {
            name: 'Полный цикл',
            link: user.portfolio_full_cycle_designer,
          },
          {
            name: 'Разное',
            link: user.portfolio_other,
          },
          {
            name: 'Фотошоп',
            link: user.portfolio_photoshop,
          },
          {
            name: 'Фотошоп',
            link: user.portfolio_picker,
          },
          {
            name: 'Procreate',
            link: user.portfolio_procreate,
          },
          {
            name: 'Администратор проекта',
            link: user.portfolio_project_administrator,
          },
          {
            name: 'Менеджер проекта',
            link: user.portfolio_project_manager,
          },
          {
            name: 'Портфолио проджект',
            link: user.portfolio_projector,
          },
          {
            name: 'Портфолио sketchup',
            link: user.portfolio_sketchup,
          },
          {
            name: 'Sketchup динамичевкие сцены ',
            link: user.portfolio_sketchup_dynamics,
          },
          {
            name: 'Sketchup визуализация ',
            link: user.portfolio_sketchup_visualization,
          },
          {
            name: 'Sketchup звук ',
            link: user.portfolio_sketchup_volume,
          },
          {
            name: 'Sketchup звук ',
            link: user.portfolio_studio_manager,
          },
        ],
      },
      {
        field: 'Контактная информация',
        items: [
          {
            label: 'Телефон',
            value: user.phone,
          },
          {
            label: 'Email',
            value: user.email,
          },
        ],
      },
      {
        field: 'Специализация',
        items: [
          user.specialization_construction_supervisor,
          user.specialization_creative_designer,
          user.specialization_equipment_specialist,
          user.specialization_general_practice_designer,
          user.specialization_project_curator,
          user.specialization_project_management_assistant,
          user.specialization_project_manager,
          user.specialization_studio_head,
          user.specialization_visual_designer,
        ],
      },
      {
        field: 'Ищу работу',
        items: [
          user.searching_work_3dmax_visualization,
          user.searching_work_creative,
          user.searching_work_decorator,
          user.searching_work_different,
          user.searching_work_different_string,
          user.searching_work_draftsman,
          user.searching_work_full_cycle_designer,
          user.searching_work_picker,
          user.searching_work_project_administrator,
          user.searching_work_project_manager,
          user.searching_work_projector,
          user.searching_work_sketchup_dynamics,
          user.searching_work_sketchup_visualization,
          user.searching_work_sketchup_volume,
          user.searching_work_studio_manager,
        ],
      },
      {
        field: 'Владение программами',
        items: [
          user.programms_archicad,
          user.programms_different,
          user.programms_different_string,
          user.programms_google,
          user.programms_ms_office,
          user.programms_photoshop,
          user.programms_procreate,
          user.programms_sketchup,
          user.programms_xmind,
          user.programms_yandex,
        ],
      },
      {
        field: 'Информация',
        items: [
          {
            label: 'Местоположение',
            value: user.cntry + ' ' + user.api_city,
          },
          {
            label: 'Возраст',
            value: user.birthday,
          },
          {
            label: 'Стоимость услуг',
            value: user.service_cost,
          },
          {
            label: 'Готовность к удаленной работе',
            value: user.distant_work,
          },
          {
            label: 'Готовность к работе прямо сейчас',
            value: user.work_now,
          },
        ],
      },
    ],
  };
};

export const MapperById = (user: UserModel): any => {
  const unit = residentMapper(user);
  const arr = unit.description_fields[0];
  let i = 0;
  for (let item in arr.items) {
    if (arr.items[i] === '') {
      delete arr.items[i];
      i++;
      return arr.items[i];
    }
    return arr.items;
  }
};
