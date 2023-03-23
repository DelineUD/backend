import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { toUserDto } from '../shared/mapper';
import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { UserModel } from './models/user.model';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';

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

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(options).exec();
    return toUserDto(user);
  }

  async findByLogin({ phone, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ phone }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
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

  async create(userDto: any): Promise<UserDto> {
    
    const { phone, password, email, id, service_cost, gender, about, site,
      instagram,
      vk,
      telegram,
      portfolio,
      searching_work_full_cycle_designer,
      portfolio_full_cycle_designer,
      searching_work_projector,
      portfolio_projector,
      searching_work_creative,
      portfolio_creative,
      searching_work_decorator,
      portfolio_decorator,
      searching_work_draftsman,
      portfolio_draftsman,
      searching_work_sketchup_dynamics,
      portfolio_sketchup_dynamics,
      searching_work_sketchup_volume,
      portfolio_sketchup_volume,
      searching_work_sketchup_visualization,
      portfolio_sketchup_visualization,
      searching_work_3dmax_visualization,
      portfolio_3dmax_visualization,
      searching_work_picker,
      portfolio_picker,
      searching_work_project_manager,
      portfolio_project_manager,
      searching_work_project_administrator,
      portfolio_project_administrator,
      searching_work_studio_manager,
      portfolio_studio_manager,
      searching_work_different,
      searching_work_different_string,
      portfolio_other,
      programms_sketchup,
      portfolio_sketchup,
      programms_photoshop,
      portfolio_photoshop,
      programms_procreate,
      portfolio_procreate,
      programms_archicad,
      portfolio_archicad,
      programms_google,
      programms_yandex,
      programms_xmind,
      programms_ms_office,
      programms_different,
      programms_different_string,
      work_now,
      qualification,
      distant_work,
      first_name,
      last_name,
      hide_phone,
      badge,
      role,
      birthday,
      qualification_color,
      specialization,
      specialization_general_practice_designer,
      specialization_designer_designer,
      specialization_designer_technologist,
      specialization_creative_designer,
      specialization_visual_designer,
      specialization_studio_head,
      specialization_project_curator,
      specialization_project_management_assistant,
      specialization_project_manager,
      specialization_equipment_specialist,
      specialization_construction_supervisor,
      cntry,
      city_ru,
      citynru,
      status,
      api_city,
      position_tag } = userDto;
      
      
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);
      console.log(phone); 
    const userInDb = await this.userModel.findOne({ phone }).exec();
    if (userInDb) {
      await userInDb.updateOne({
        phone,
        email,
        id,
        service_cost,
        gender,
        about,
        site,
        instagram,
        vk,
        telegram,
        portfolio,
        searching_work_full_cycle_designer,
        portfolio_full_cycle_designer,
        searching_work_projector,
        portfolio_projector,
        searching_work_creative,
        portfolio_creative,
        searching_work_decorator,
        portfolio_decorator,
        searching_work_draftsman,
        portfolio_draftsman,
        searching_work_sketchup_dynamics,
        portfolio_sketchup_dynamics,
        searching_work_sketchup_volume,
        portfolio_sketchup_volume,
        searching_work_sketchup_visualization,
        portfolio_sketchup_visualization,
        searching_work_3dmax_visualization,
        portfolio_3dmax_visualization,
        searching_work_picker,
        portfolio_picker,
        searching_work_project_manager,
        portfolio_project_manager,
        searching_work_project_administrator,
        portfolio_project_administrator,
        searching_work_studio_manager,
        portfolio_studio_manager,
        searching_work_different,
        searching_work_different_string,
        portfolio_other,
        programms_sketchup,
        portfolio_sketchup,
        programms_photoshop,
        portfolio_photoshop,
        programms_procreate,
        portfolio_procreate,
        programms_archicad,
        portfolio_archicad,
        programms_google,
        programms_yandex,
        programms_xmind,
        programms_ms_office,
        programms_different,
        programms_different_string,
        work_now,
        qualification,
        distant_work,
        first_name,
        last_name,
        hide_phone,
        badge,
        role,
        birthday,
        qualification_color,
        specialization,
        specialization_general_practice_designer,
        specialization_designer_designer,
        specialization_designer_technologist,
        specialization_creative_designer,
        specialization_visual_designer,
        specialization_studio_head,
        specialization_project_curator,
        specialization_project_management_assistant,
        specialization_project_manager,
        specialization_equipment_specialist,
        specialization_construction_supervisor,
        cntry,
        city_ru,
        citynru,
        status,
        api_city,
        position_tag
      });
      
      await userInDb.save();

      return toUserDto(userInDb);
    }

    else {
      console.log(userDto);
    const user: UserModel = await new this.userModel({
      phone,
      password: hashPassword,
      email,
      id,
      service_cost,
      gender,
      about,
      site,
      instagram,
      vk,
      telegram,
      portfolio,
      searching_work_full_cycle_designer,
      portfolio_full_cycle_designer,
      searching_work_projector,
      portfolio_projector,
      searching_work_creative,
      portfolio_creative,
      searching_work_decorator,
      portfolio_decorator,
      searching_work_draftsman,
      portfolio_draftsman,
      searching_work_sketchup_dynamics,
      portfolio_sketchup_dynamics,
      searching_work_sketchup_volume,
      portfolio_sketchup_volume,
      searching_work_sketchup_visualization,
      portfolio_sketchup_visualization,
      searching_work_3dmax_visualization,
      portfolio_3dmax_visualization,
      searching_work_picker,
      portfolio_picker,
      searching_work_project_manager,
      portfolio_project_manager,
      searching_work_project_administrator,
      portfolio_project_administrator,
      searching_work_studio_manager,
      portfolio_studio_manager,
      searching_work_different,
      searching_work_different_string,
      portfolio_other,
      programms_sketchup,
      portfolio_sketchup,
      programms_photoshop,
      portfolio_photoshop,
      programms_procreate,
      portfolio_procreate,
      programms_archicad,
      portfolio_archicad,
      programms_google,
      programms_yandex,
      programms_xmind,
      programms_ms_office,
      programms_different,
      programms_different_string,
      work_now,
      qualification,
      distant_work,
      first_name,
      last_name,
      hide_phone,
      badge,
      role,
      birthday,
      qualification_color,
      specialization,
      specialization_general_practice_designer,
      specialization_designer_designer,
      specialization_designer_technologist,
      specialization_creative_designer,
      specialization_visual_designer,
      specialization_studio_head,
      specialization_project_curator,
      specialization_project_management_assistant,
      specialization_project_manager,
      specialization_equipment_specialist,
      specialization_construction_supervisor,
      cntry,
      city_ru,
      citynru,
      status,
      api_city,
      position_tag,
      
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

  async findById(options?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(options).exec();
    return toUserDto(user);
  }

  async update(data?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(data).exec();
    return toUserDto(user);
}
}