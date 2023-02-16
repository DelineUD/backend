import {
    Controller,
    Body,
    Post,
    HttpException,
    HttpStatus,
    Get,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { RegistrationStatus } from './interfaces/regisration-status.interface';
  import { AuthService } from './auth.service';
  import { LoginStatus } from './interfaces/login-status.interface';
  import { LoginStatus1 } from './interfaces/login-status1.interface';
  import { LoginUserDto } from '../users/dto/user-login.dto';
  import { JwtPayload } from './interfaces/payload.interface';
  import { AuthGuard } from '@nestjs/passport';
  import { CreateUserDto } from '../users/dto/user.create.dto';
  import { LoginStatus2 } from './interfaces/login-status2.interface';
  import { RefreshTokenDto } from './dto/refreshToken.dto'

  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @UsePipes(new ValidationPipe())
    @Post('register')
    public async register(
      @Body() createUserDto: CreateUserDto
    ): Promise<RegistrationStatus> {
      const result: RegistrationStatus = await this.authService.register(
        createUserDto
      );
  
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
  
      return result;
    }
  
    @UsePipes(new ValidationPipe())
    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
      return await this.authService.login(loginUserDto);
    }
  
    @Get('profile')
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
      return req.user;
    }
   //sans
    @Post('login1')
    public async login1(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus1> {
      return await this.authService.login1(loginUserDto);
    }

    @Post('login2')
    public async login2(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus2> {
      
      if(loginUserDto.vpass != 1111){
        throw new HttpException('FUCK OFF!!!!', HttpStatus.UNAUTHORIZED);
      }
      if(!loginUserDto.phone){
        throw new HttpException('FUCK OFF!!!!', HttpStatus.UNAUTHORIZED);
      }
      return await this.authService.login2(loginUserDto);
    }
    @Post('refresh')
    async getNewTokens(@Body() data: RefreshTokenDto) {
      return this.authService.getNewTokens(data)
    }
    
//sans
  }