import { UserModel } from '../users/models/user.model';
import { IResidentList } from './interfaces/resident.interface-list';

export const residentListMapper = (user: UserModel[]): IResidentList[] => {
  return user.map(residentsMapper);
};

export const residentsMapper = (user: UserModel): IResidentList => {
  return {
    _id: user._id,
    avatar: user.avatar,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};
type ItemLabel = {
  label: string;
  value: string;
};

const getItemWithLabel = (
  user: UserModel,
  fieldName: string,
  label: string,
): ItemLabel[] => {
  return user[fieldName]
    ? [
        {
          label,
          value: user[fieldName],
        },
      ]
    : [];
};

const getItemString = (user: UserModel, fieldName: string): string[] => {
  return user[fieldName] ? [user[fieldName]] : [];
};

export const residentMapper = (user: UserModel): any => {
  return {
    _id: user._id,

    first_name: user.first_name,

    last_name: user.last_name,

    avatar: user.avatar,

    about: user.about,

    description_fields: [
      {
        field: 'Портфолио',

        items: [
          ...getItemWithLabel(
            user,
            'portfolio_3dmax_visualization',
            'Визуализация в 3D max',
          ),
          ...getItemWithLabel(user, 'portfolio_archicad', 'Архикад'),
          ...getItemWithLabel(user, 'portfolio_creative', 'Креатив'),
          ...getItemWithLabel(user, 'portfolio_decorator', 'Декоратор'),
          ...getItemWithLabel(user, 'portfolio_draftsman', 'Чертежи'),
          ...getItemWithLabel(
            user,
            'portfolio_full_cycle_designer',
            'Полный цикл',
          ),
          ...getItemWithLabel(user, 'portfolio_other', 'Разное'),
          ...getItemWithLabel(user, 'portfolio_photoshop', 'Фотошоп'),
          ...getItemWithLabel(user, 'portfolio_picker', 'Пикер'),
          ...getItemWithLabel(user, 'portfolio_procreate', 'Procreate'),
          ...getItemWithLabel(
            user,
            'portfolio_project_administrator',
            'Администратор проекта',
          ),
          ...getItemWithLabel(
            user,
            'portfolio_project_manager',
            'Менеджер проекта',
          ),
          ...getItemWithLabel(
            user,
            'portfolio_projector',
            'Портфолио проджект',
          ),
          ...getItemWithLabel(user, 'portfolio_sketchup', 'Портфолио sketchup'),
          ...getItemWithLabel(
            user,
            'portfolio_sketchup_dynamics',
            'Sketchup динамичевкие сцены',
          ),
          ...getItemWithLabel(
            user,
            'portfolio_sketchup_visualization',
            'Sketchup визуализация',
          ),
          ...getItemWithLabel(
            user,
            'portfolio_sketchup_volume',
            'Sketchup звук',
          ),
          ...getItemWithLabel(
            user,
            'portfolio_studio_manager',
            'Менеджер студии',
          ),
        ],
      },
      {
        field: 'Контактная информация',
        items: [
          ...getItemWithLabel(user, 'phone', 'Телефон'),
          ...getItemWithLabel(user, 'email', 'Email'),
        ],
      },
      {
        field: 'Специализация',
        items: [
          ...getItemString(user, 'specialization_construction_supervisor'),
          ...getItemString(user, 'specialization_creative_designer'),
          ...getItemString(user, 'specialization_equipment_specialist'),
          ...getItemString(user, 'specialization_general_practice_designer'),
          ...getItemString(user, 'specialization_project_curator'),
          ...getItemString(user, 'specialization_project_management_assistant'),
          ...getItemString(user, 'specialization_project_manager'),
          ...getItemString(user, 'specialization_studio_head'),
          ...getItemString(user, 'specialization_visual_designer'),
        ],
      },
      {
        field: 'Ищу работу',
        items: [
          ...getItemString(user, 'searching_work_3dmax_visualization'),
          ...getItemString(user, 'searching_work_creative'),
          ...getItemString(user, 'searching_work_decorator'),
          ...getItemString(user, 'searching_work_different'),
          ...getItemString(user, 'searching_work_different_string'),
          ...getItemString(user, 'searching_work_draftsman'),
          ...getItemString(user, 'searching_work_full_cycle_designer'),
          ...getItemString(user, 'searching_work_picker'),
          ...getItemString(user, 'searching_work_project_administrator'),
          ...getItemString(user, 'searching_work_project_manager'),
          ...getItemString(user, 'searching_work_projector'),
          ...getItemString(user, 'searching_work_sketchup_dynamics'),
          ...getItemString(user, 'searching_work_sketchup_visualization'),
          ...getItemString(user, 'searching_work_sketchup_volume'),
          ...getItemString(user, 'searching_work_studio_manager'),
        ],
      },
      {
        field: 'Владение программами',
        items: [
          ...getItemString(user, 'programms_archicad'),
          ...getItemString(user, 'programms_different'),
          ...getItemString(user, 'programms_different_string'),
          ...getItemString(user, 'programms_google'),
          ...getItemString(user, 'programms_ms_office'),
          ...getItemString(user, 'programms_photoshop'),
          ...getItemString(user, 'programms_procreate'),
          ...getItemString(user, 'programms_sketchup'),
          ...getItemString(user, 'programms_xmind'),
          ...getItemString(user, 'programms_yandex'),
        ],
      },
      {
        field: 'Информация',
        items: [
          ...getItemWithLabel(user, 'birthday', 'Возраст'),
          ...getItemWithLabel(user, 'ervice_cost', 'Стоимость услуг'),
          ...getItemWithLabel(
            user,
            'distant_work',
            'Готовность к удаленной работе',
          ),
          ...getItemWithLabel(
            user,
            'work_now',
            'Готовность к работе прямо сейчас',
          ),
        ],
      },
    ],
  };
};
