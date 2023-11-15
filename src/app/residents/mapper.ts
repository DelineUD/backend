import { UserModel } from '../users/models/user.model';
import { IResidentList } from './interfaces/resident.interface-list';
import { IResident, ItemLabel } from './interfaces/resident.interface';

const programsFieldsOfUser: string[] = [
  'programms_sketchup',
  'programms_enscape',
  'programms_lumen',
  'programms_autocad',
  'programms_archicad',
  'programms_revit',
  'programms_3dmax',
]; // Programs fields of user dto

const coursesFieldsOfUser: string[] = [
  'courseud_masstart',
  'courseud_prof',
  'courseud_build',
  'courseud_sketchup',
  'courseud_dnd',
]; // Courses fields of user dto

const specFieldsOfUser: string[] = [
  'specialization_creative_designer',
  'specialization_general_practice_designer',
  'specialization_full_cycle_designer',
  'specialization_decorator',
  'specialization_complect',
  'specialization_author_control',
  'specialization_project_manager',
  'specialization_project_owner',
  'specialization_studio_owner',
  'specialization_assist',
  'specialization_sketchup',
  'specialization_sketch_model',
  'specialization_enscape',
  'specialization_sketch_mebel',
  'specialization_enscape_viz',
  'specialization_3dmax_viz',
  'specialization_plan_autocad',
  'specialization_plan_arch',
  'specialization_plan_revit',
  'specialization_measurement',
]; // Specializations fields of user dto

const narrowSpecFieldsOfUser: string[] = [
  'narrow_spec_measurement',
  'narrow_spec_measurement_create',
  'narrow_spec_anket_tz',
  'narrow_spec_plan_plane',
  'narrow_spec_sketch_white',
  'narrow_spec_concept',
  'narrow_spec_sketch_volume',
  'narrow_spec_viz_sketch',
  'narrow_spec_viz_3dmax',
  'narrow_spec_viz_other',
  'narrow_spec_viz_enscape',
  'narrow_spec_viz_create_schem_viz',
  'narrow_spec_pccp',
  'narrow_spec_sop_compl',
  'narrow_spec_author_spec',
  'narrow_spec_release_cpec',
  'narrow_spec_project_manager',
  'narrow_spec_project_owner',
  'narrow_spec_studio_owner',
  'narrow_spec_cmm_diz',
  'narrow_spec_reels_maker',
  'narrow_spec_diz_assist',
  'narrow_spec_office_manager',
  'narrow_spec_graph_diz',
]; // Narrow specializations fields of user dto

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

const getItemString = (user: UserModel, fieldName: string): string => {
  return user[fieldName] && user[fieldName];
};

const toResidentFormat = (user: UserModel, fields: string[]) => {
  return [...fields.filter((field) => getItemString(user, field))];
};

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

export const residentMapper = (user: UserModel): IResident => {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    about: user.about,
    status: user.status,
    avatar: user.avatar,

    personal_information: [
      {
        birthday: user.birthday,
        gender: user.gender,
        citynru: user.citynru,
        city_ru: user.city_ru,
      },
    ],
    description_fields: [
      {
        filed: 'Владение программами',
        items: toResidentFormat(user, programsFieldsOfUser),
      },
      {
        filed: 'Пройденные курсы',
        items: toResidentFormat(user, coursesFieldsOfUser),
      },
      {
        filed: 'Специализация',
        items: toResidentFormat(user, specFieldsOfUser),
      },
      {
        filed: 'Узкая специализация',
        items: toResidentFormat(user, narrowSpecFieldsOfUser),
      },
    ],
  };
};
