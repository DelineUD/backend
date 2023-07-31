import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('filters')
@UseGuards(AuthGuard('jwt'))
export class FiltersController {
  @Get('posts')
  public async getList(@Request() data: any): Promise<any> {
    const result = [
      {
        name: 'group',
        values: [
          {
            code: 'pf001',
            name: 'Общее',
          },
          {
            code: 'pf002',
            name: 'Администрация',
          },
          {
            code: 'pf003',
            name: 'HH',
          },
        ],
        multi: false,
      },
    ];
    return result;
  }
}
