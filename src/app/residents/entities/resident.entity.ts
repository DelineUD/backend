import { ApiProperty } from '@nestjs/swagger';

export class Resident {
  @ApiProperty({
    example: 'id',
    description: 'id резидента',
    nullable: true,
  })
  _id: string;

  @ApiProperty({
    example: 'новичок',
    description: 'Квалификация резидента',
    nullable: true,
  })
  qualification: string;

  @ApiProperty({
    example: 'Имя',
    description: 'Имя резидента',
    nullable: true,
  })
  first_name: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Фамилия резидента',
    nullable: true,
  })
  last_name: string;

  @ApiProperty({
    example: 'Бэйдж',
    description: 'Бэйдж резидента',
    nullable: true,
  })
  badge: string;

  @ApiProperty({
    example: 'Аватар',
    description: 'Аватар резидента',
    nullable: true,
  })
  avatar: string;

  @ApiProperty({
    example: 'Инста',
    description: 'Инста резидента',
    nullable: true,
  })
  instagram: string;

  @ApiProperty({
    example: 'ВК',
    description: 'ВК резидента',
    nullable: true,
  })
  vk: string;

  @ApiProperty({
    example: 'Телеша',
    description: 'Телега резидента',
    nullable: true,
  })
  telegram: string;

  @ApiProperty({
    example: 'Портфолио',
    description: 'Портфолио резидента',
    nullable: true,
  })
  portfolio: string;

  @ApiProperty({
    example: 'Инфо',
    description: 'Инфо резидента',
    nullable: true,
  })
  about: string;

  @ApiProperty({
    example: 'Креативный дизайнер',
    description: 'Креативный дизайнер портфолио',
    nullable: true,
  })
  portfolio_creative: string;

  @ApiProperty({
    example: 'Декортаор',
    description: 'Декоратор портфолио',
    nullable: true,
  })
  portfolio_decorator: string;

  @ApiProperty({
    example: 'Чертежи',
    description: 'Чертежи портфолио',
    nullable: true,
  })
  portfolio_draftsman: string;

  @ApiProperty({
    example: 'Дизайнер полного цикла',
    description: 'Дизайнер полного цикла портфолио',
    nullable: true,
  })
  portfolio_full_cycle_designer: string;

  @ApiProperty({
    example: 'Озэр',
    description: 'Озэр полного цикла портфолио',
    nullable: true,
  })
  portfolio_other: string;

  @ApiProperty({
    example: 'Фотошоп',
    description: 'Фотошоп портфолио',
    nullable: true,
  })
  portfolio_photoshop: string;

  @ApiProperty({
    example: 'Пикер',
    description: 'Пикер портфолио',
    nullable: true,
  })
  portfolio_picker: string;

  @ApiProperty({
    example: 'Прокриеэйт',
    description: 'Прокриеэйт портфолио',
    nullable: true,
  })
  portfolio_procreate: string;

  @ApiProperty({
    example: 'Админ проекта',
    description: 'Админ проекта портфолио',
    nullable: true,
  })
  portfolio_project_administrator: string;

  @ApiProperty({
    example: 'Менеджер проекта',
    description: 'Менеджер проекта портфолио',
    nullable: true,
  })
  portfolio_project_manager: string;

  @ApiProperty({
    example: 'Проджект',
    description: 'Проджект портфолио',
    nullable: true,
  })
  portfolio_projector: string;

  @ApiProperty({
    example: 'Скетчап',
    description: 'Скетчап портфолио',
    nullable: true,
  })
  portfolio_sketchup: string;

  @ApiProperty({
    example: 'Динамические компоненты',
    description: 'Динамические компоненты портфолио',
    nullable: true,
  })
  portfolio_sketchup_dynamics: string;

  @ApiProperty({
    example: 'Скетчап визуализация',
    description: 'Скетчап визуализация портфолио',
    nullable: true,
  })
  portfolio_sketchup_visualization: string;

  @ApiProperty({
    example: 'Скетчап звук',
    description: 'Скетчап звук портфолио',
    nullable: true,
  })
  portfolio_sketchup_volume: string;

  @ApiProperty({
    example: 'Менеджер студии',
    description: 'Менеджер студии портфолио',
    nullable: true,
  })
  portfolio_studio_manager: string;

  @ApiProperty({
    example: '3д макс визуализация',
    description: '3д макс визуализация портфолио',
    nullable: true,
  })
  portfolio_3dmax_visualization: string;

  @ApiProperty({
    example: 'Архикад',
    description: 'Архикад портфолио',
    nullable: true,
  })
  portfolio_archicad: string;

  @ApiProperty({
    example: '+9999999999',
    description: 'телефон',
    nullable: true,
  })
  phone: number;

  @ApiProperty({
    example: 'email',
    description: 'Поста пезидента',
    nullable: true,
  })
  email: string;

  @ApiProperty({
    example: 'Специализация руководитель студии',
    description: 'Специализация руководитель студии',
    nullable: true,
  })
  specialization_construction_supervisor: string;

  @ApiProperty({
    example: 'Креативный дизайнер',
    description: 'Специализация Креативный дизайнер',
    nullable: true,
  })
  specialization_creative_designer: string;

  @ApiProperty({
    example: 'Комплектатор',
    description: 'Специализация Комплектатор',
    nullable: true,
  })
  specialization_equipment_specialist: string;

  @ApiProperty({
    example: 'Дизайнер общей практики',
    description: 'Специализация Дизайнер общей практики',
    nullable: true,
  })
  specialization_general_practice_designer: string;

  @ApiProperty({
    example: 'Круатор проекта',
    description: 'Специализация Круатор проекта',
    nullable: true,
  })
  specialization_project_curator: string;

  @ApiProperty({
    example: 'Ассистент менеджера проекта',
    description: 'Специализация Ассистент менеджера проекта',
    nullable: true,
  })
  specialization_project_management_assistant: string;

  @ApiProperty({
    example: 'Менеджер проекта',
    description: 'Специализация Менеджер проекта',
    nullable: true,
  })
  specialization_project_manager: string;

  @ApiProperty({
    example: 'Руководитель студии',
    description: 'Руководитель студии Специализация',
    nullable: true,
  })
  specialization_studio_head: string;

  @ApiProperty({
    example: 'Дизайнер визуализатор',
    description: 'Дизайнер визуализатор портфолио',
    nullable: true,
  })
  specialization_visual_designer: string;

  @ApiProperty({
    example: 'Визуализатор в 3д макс',
    description: 'Визуализатор в 3д макс Ищу вакансию',
    nullable: true,
  })
  searching_work_3dmax_visualization: string;

  @ApiProperty({
    example: 'Креативный дизайнер',
    description: 'Креативный дизайнер Ищу вакансию',
    nullable: true,
  })
  searching_work_creative: string;

  @ApiProperty({
    example: 'Декортаор',
    description: 'Декортаор Ищу вакансию',
    nullable: true,
  })
  searching_work_decorator: string;

  @ApiProperty({
    example: 'Другое',
    description: 'Другое Ищу вакансию',
    nullable: true,
  })
  searching_work_different: string;

  @ApiProperty({
    example: 'Другое наименование',
    description: 'Другое наименование Ищу вакансию',
    nullable: true,
  })
  searching_work_different_string: string;

  @ApiProperty({
    example: 'Чертежник',
    description: 'Чертежник Ищу вакансию',
    nullable: true,
  })
  searching_work_draftsman: string;

  @ApiProperty({
    example: 'Дизанер полного цикла',
    description: 'Дизанер полного цикла Ищу вакансию',
    nullable: true,
  })
  searching_work_full_cycle_designer: string;

  @ApiProperty({
    example: 'комплектатор',
    description: 'комплектатор Ищу вакансию',
    nullable: true,
  })
  searching_work_picker: string;

  @ApiProperty({
    example: 'администратор проекта',
    description: 'администратор проекта Ищу вакансию',
    nullable: true,
  })
  searching_work_project_administrator: string;

  @ApiProperty({
    example: 'Менеджер проекта',
    description: 'Менеджер проекта Ищу вакансию',
    nullable: true,
  })
  searching_work_project_manager: string;

  @ApiProperty({
    example: 'проектировщик',
    description: 'проектировщик Ищу вакансию',
    nullable: true,
  })
  searching_work_projector?: string;

  @ApiProperty({
    example: 'sketchup динамика',
    description: 'sketchup динамика Ищу вакансию',
    nullable: true,
  })
  searching_work_sketchup_dynamics: string;

  @ApiProperty({
    example: 'sketchup визуализация',
    description: 'sketchup визуализация Ищу вакансию',
    nullable: true,
  })
  searching_work_sketchup_visualization: string;

  @ApiProperty({
    example: 'sketchup объем',
    description: 'sketchup объем Ищу вакансию',
    nullable: true,
  })
  searching_work_sketchup_volume: string;

  @ApiProperty({
    example: 'руководитель студии',
    description: 'руководитель студии Ищу вакансию',
    nullable: true,
  })
  searching_work_studio_manager: string;

  @ApiProperty({
    example: 'Архикад',
    description: 'Архикад Владение программами',
    nullable: true,
  })
  programms_archicad: string;

  @ApiProperty({
    example: 'другое',
    description: 'другое Владение программами',
    nullable: true,
  })
  programms_different: string;

  @ApiProperty({
    example: 'Другое значение',
    description: 'Другое значение Владение программами',
    nullable: true,
  })
  programms_different_string: string;

  @ApiProperty({
    example: 'Гугл',
    description: 'Гугл Владение программами',
    nullable: true,
  })
  programms_google: string;

  @ApiProperty({
    example: 'МС офис',
    description: 'МС офис Владение программами',
    nullable: true,
  })
  programms_ms_office: string;

  @ApiProperty({
    example: 'Фотошоп',
    description: 'Фотошоп Владение программами',
    nullable: true,
  })
  programms_photoshop: string;

  @ApiProperty({
    example: 'Прокриэйт',
    description: 'Прокриэйт Владение программами',
    nullable: true,
  })
  programms_procreate: string;

  @ApiProperty({
    example: 'Скетчап',
    description: 'Скетчап Владение программами',
    nullable: true,
  })
  programms_sketchup: string;

  @ApiProperty({
    example: 'Икс майнд',
    description: 'Икс майнд Владение программами',
    nullable: true,
  })
  programms_xmind: string;

  @ApiProperty({
    example: 'Яндекс',
    description: 'Яндекс Владение программами',
    nullable: true,
  })
  programms_yandex: string;

  @ApiProperty({
    example: 'Страна',
    description: 'Страна резидента',
    nullable: true,
  })
  cntry?: string;

  @ApiProperty({
    example: 'Город',
    description: 'Город резидента',
    nullable: true,
  })
  api_city: string;

  @ApiProperty({
    example: 'Возраст',
    description: 'Возраст резидента',
    nullable: true,
  })
  birthday: string;

  @ApiProperty({
    example: 'Стоимость услуг',
    description: 'Стоимость услуг резидента',
    nullable: true,
  })
  service_cost: string;

  @ApiProperty({
    example: 'Работать сейчас',
    description: 'Готовность работать сейчас',
    nullable: true,
  })
  work_now?: string;

  @ApiProperty({
    example: 'Дстанционно',
    description: 'Готовность работать дистанционно',
    nullable: true,
  })
  distant_work: string;
}
