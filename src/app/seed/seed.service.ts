import { Injectable, Logger } from '@nestjs/common';

import { FiltersService } from '@app/filters/filters.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private filtersService: FiltersService) {}

  async seed() {
    try {
      await this.down();
      await this.up();
    } catch (err) {
      throw err;
    }
  }

  private async down() {
    this.logger.log('Seed downed!');
  }

  private async up() {
    await this.filtersService.seedAllFilters();
    this.logger.log('Seed upped!');
  }
}
