import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { toUserDto } from '../shared/mapper';
import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { UserModel } from './models/user.model';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getUsers(): Promise<UserModel[]> {
    const users = await this.userModel.find({});

    return users;
  }

  async findOne(where): Promise<UserModel> {
    try {
      const user = await this.userModel.findOne(where).exec();
      return user;
    } catch (e) {
      throw new EntityNotFoundError(e);
    }
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError('User not found');
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return toUserDto(user);
  }

  async findByPayload({ phone }: any): Promise<UserDto> {
    return await this.findOne({ phone });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {

      
      const salt = await genSalt(10);
      const hashPassword = await hash(createUserDto.password, salt);
  const phone = createUserDto.phone;
    const userInDb = await this.userModel.findOne({ phone }).exec();
    if (userInDb) {
      await userInDb.updateOne({
        phone,
        password:hashPassword,
        email:createUserDto.email,
        id:createUserDto.id,
        service_cost:createUserDto.service_cost,
        gender:createUserDto.gender,
        about:createUserDto.about,
        site:createUserDto.site,
        instagram:createUserDto.instagram,
        vk:createUserDto.vk,
        telegram:createUserDto.telegram,
        portfolio:createUserDto.portfolio,
        searching_work_full_cycle_designer:createUserDto.searching_work_full_cycle_designer,
        portfolio_full_cycle_designer:createUserDto.portfolio_full_cycle_designer,
        searching_work_projector:createUserDto.searching_work_projector,
        portfolio_projector:createUserDto.portfolio_projector,
        searching_work_creative:createUserDto.searching_work_creative,
        portfolio_creative:createUserDto.portfolio_creative,
        searching_work_decorator:createUserDto.searching_work_decorator,
        portfolio_decorator:createUserDto.portfolio_decorator,
        searching_work_draftsman:createUserDto.searching_work_draftsman,
        portfolio_draftsman:createUserDto.portfolio_draftsman,
        searching_work_sketchup_dynamics:createUserDto.searching_work_sketchup_dynamics,
        portfolio_sketchup_dynamics:createUserDto.portfolio_sketchup_dynamics,
        searching_work_sketchup_volume:createUserDto.searching_work_sketchup_volume,
        portfolio_sketchup_volume:createUserDto.portfolio_sketchup_volume,
        searching_work_sketchup_visualization:createUserDto.searching_work_sketchup_visualization,
        portfolio_sketchup_visualization:createUserDto.portfolio_sketchup_visualization,
        searching_work_3dmax_visualization:createUserDto.searching_work_3dmax_visualization,
        portfolio_3dmax_visualization:createUserDto.portfolio_3dmax_visualization,
        searching_work_picker:createUserDto.searching_work_picker,
        portfolio_picker:createUserDto.portfolio_picker,
        searching_work_project_manager:createUserDto.searching_work_project_manager,
        portfolio_project_manager:createUserDto.portfolio_project_manager,
        searching_work_project_administrator:createUserDto.searching_work_project_administrator,
        portfolio_project_administrator:createUserDto.portfolio_project_administrator,
        searching_work_studio_manager:createUserDto.searching_work_studio_manager,
        portfolio_studio_manager:createUserDto.portfolio_studio_manager,
        searching_work_different:createUserDto.searching_work_different,
        searching_work_different_string:createUserDto.searching_work_different_string,
        portfolio_other:createUserDto.portfolio_other,
        programms_sketchup:createUserDto.programms_sketchup,
        portfolio_sketchup:createUserDto.portfolio_sketchup,
        programms_photoshop:createUserDto.programms_photoshop,
        portfolio_photoshop:createUserDto.portfolio_photoshop,
        programms_procreate:createUserDto.programms_procreate,
        portfolio_procreate:createUserDto.portfolio_procreate,
        programms_archicad:createUserDto.programms_archicad,
        portfolio_archicad:createUserDto.portfolio_archicad,
        programms_google:createUserDto.programms_google,
        programms_yandex:createUserDto.programms_yandex,
        programms_xmind:createUserDto.programms_xmind,
        programms_ms_office:createUserDto.programms_ms_office,
        programms_different:createUserDto.programms_different,
        programms_different_string:createUserDto.programms_different_string,
        work_now:createUserDto.work_now,
        qualification:createUserDto.qualification,
        distant_work:createUserDto.distant_work,
        first_name:createUserDto.first_name,
        last_name:createUserDto.last_name,
        hide_phone:createUserDto.hide_phone,
        badge:createUserDto.badge,
        role:createUserDto.role,
        birthday:createUserDto.birthday,
        qualification_color:createUserDto.qualification_color,
        specialization:createUserDto.specialization,
        specialization_general_practice_designer:createUserDto.specialization_general_practice_designer,
        specialization_designer_designer:createUserDto.specialization_designer_designer,
        specialization_designer_technologist:createUserDto.specialization_designer_technologist,
        specialization_creative_designer:createUserDto.specialization_creative_designer,
        specialization_visual_designer:createUserDto.specialization_visual_designer,
        specialization_studio_head:createUserDto.specialization_studio_head,
        specialization_project_curator:createUserDto.specialization_project_curator,
        specialization_project_management_assistant:createUserDto.specialization_project_management_assistant,
        specialization_project_manager:createUserDto.specialization_project_manager,
        specialization_equipment_specialist:createUserDto.specialization_equipment_specialist,
        specialization_construction_supervisor:createUserDto.specialization_construction_supervisor,
        cntry:createUserDto.cntry,
        city_ru:createUserDto.city_ru,
        citynru:createUserDto.citynru,
        status:createUserDto.status,
        api_city:createUserDto.api_city,
        position_tag:createUserDto.position_tag
      });
      
      await userInDb.save();


      return toUserDto(userInDb);
    }

    else {

    const user: UserModel = new this.userModel({
      phone,
      email: createUserDto.email,
      id: createUserDto.id,
      service_cost: createUserDto.service_cost,
      gender: createUserDto.gender,
      about: createUserDto.about,
      site: createUserDto.site,
      instagram: createUserDto.instagram,
      vk: createUserDto.vk,
      telegram: createUserDto.telegram,
      portfolio: createUserDto.portfolio,
      searching_work_full_cycle_designer: createUserDto.searching_work_full_cycle_designer,
      portfolio_full_cycle_designer: createUserDto.portfolio_full_cycle_designer,
      searching_work_projector: createUserDto.searching_work_projector,
      portfolio_projector: createUserDto.portfolio_projector,
      searching_work_creative: createUserDto.searching_work_creative,
      portfolio_creative: createUserDto.portfolio_creative,
      searching_work_decorator: createUserDto.searching_work_decorator,
      portfolio_decorator: createUserDto.portfolio_decorator,
      searching_work_draftsman: createUserDto.searching_work_draftsman,
      portfolio_draftsman: createUserDto.portfolio_draftsman,
      searching_work_sketchup_dynamics: createUserDto.searching_work_sketchup_dynamics,
      portfolio_sketchup_dynamics: createUserDto.portfolio_sketchup_dynamics,
      searching_work_sketchup_volume: createUserDto.searching_work_sketchup_volume,
      portfolio_sketchup_volume: createUserDto.portfolio_sketchup_volume,
      searching_work_sketchup_visualization: createUserDto.searching_work_sketchup_visualization,
      portfolio_sketchup_visualization: createUserDto.portfolio_sketchup_visualization,
      searching_work_3dmax_visualization: createUserDto.searching_work_3dmax_visualization,
      portfolio_3dmax_visualization: createUserDto.portfolio_3dmax_visualization,
      searching_work_picker: createUserDto.searching_work_picker,
      portfolio_picker: createUserDto.portfolio_picker,
      searching_work_project_manager: createUserDto.searching_work_project_manager,
      portfolio_project_manager: createUserDto.portfolio_project_manager,
      searching_work_project_administrator: createUserDto.searching_work_project_administrator,
      portfolio_project_administrator: createUserDto.portfolio_project_administrator,
      searching_work_studio_manager: createUserDto.searching_work_studio_manager,
      portfolio_studio_manager: createUserDto.portfolio_studio_manager,
      searching_work_different: createUserDto.searching_work_different,
      searching_work_different_string: createUserDto.searching_work_different_string,
      portfolio_other: createUserDto.portfolio_other,
      programms_sketchup: createUserDto.programms_sketchup,
      portfolio_sketchup: createUserDto.portfolio_sketchup,
      programms_photoshop: createUserDto.programms_photoshop,
      portfolio_photoshop: createUserDto.portfolio_photoshop,
      programms_procreate: createUserDto.programms_procreate,
      portfolio_procreate: createUserDto.portfolio_procreate,
      programms_archicad: createUserDto.programms_archicad,
      portfolio_archicad: createUserDto.portfolio_archicad,
      programms_google: createUserDto.programms_google,
      programms_yandex: createUserDto.programms_yandex,
      programms_xmind: createUserDto.programms_xmind,
      programms_ms_office: createUserDto.programms_ms_office,
      programms_different: createUserDto.programms_different,
      programms_different_string: createUserDto.programms_different_string,
      work_now: createUserDto.work_now,
      qualification: createUserDto.qualification,
      distant_work: createUserDto.distant_work,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      hide_phone: createUserDto.hide_phone,
      badge: createUserDto.badge,
      role: createUserDto.role,
      birthday: createUserDto.birthday,
      qualification_color: createUserDto.qualification_color,
      specialization: createUserDto.specialization,
      specialization_general_practice_designer: createUserDto.specialization_general_practice_designer,
      specialization_designer_designer: createUserDto.specialization_designer_designer,
      specialization_designer_technologist: createUserDto.specialization_designer_technologist,
      specialization_creative_designer: createUserDto.specialization_creative_designer,
      specialization_visual_designer: createUserDto.specialization_visual_designer,
      specialization_studio_head: createUserDto.specialization_studio_head,
      specialization_project_curator: createUserDto.specialization_project_curator,
      specialization_project_management_assistant: createUserDto.specialization_project_management_assistant,
      specialization_project_manager: createUserDto.specialization_project_manager,
      specialization_equipment_specialist: createUserDto.specialization_equipment_specialist,
      specialization_construction_supervisor: createUserDto.specialization_construction_supervisor,
      cntry: createUserDto.cntry,
      city_ru: createUserDto.city_ru,
      citynru: createUserDto.citynru,
      status: createUserDto.status,
      api_city: createUserDto.api_city,
      position_tag: createUserDto.position_tag
    });

    await user.save();

    return toUserDto(user);
  }
  }

  async findByPhone({ phone }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new EntityNotFoundError(
        `Пользователь с телефоном ${phone} не найден`,
      );
    }

    return toUserDto(user);
  }

  async findById(where): Promise<UserModel> {
    const user = await this.userModel.findOne(where).exec();
    return user;
  }

  async update(where, newData): Promise<UserModel> {
    let user: UserModel;

    try {
      user = await this.userModel.findOneAndUpdate(where, newData, {
        new: true,
      });
    } catch (e) {
      throw new EntityNotFoundError(e);
    }

    return user;
  }

  async updateUsr(data?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(data).exec();
    return toUserDto(user);
}
}