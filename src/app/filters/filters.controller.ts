import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('Filters')
@UseGuards(JwtAuthGuard)
export class FiltersController {
  @Get('posts')
  public async getList(@Request() data: any): Promise<unknown> {
    console.log(data);
    return [
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
  }
}
