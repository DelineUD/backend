import { Logger, Module, OnModuleInit } from '@nestjs/common';

import { FiltersModule } from '@app/filters/filters.module';
import { SeedService } from './seed.service';

@Module({
  imports: [FiltersModule],
  providers: [SeedService],
})
export class SeedModule implements OnModuleInit {
  private readonly logger = new Logger(SeedModule.name);

  constructor(private seedService: SeedService) {}

  onModuleInit(): void {
    this.seedService
      .seed()
      .then(() => {
        this.logger.log('Seeding completed!');
      })
      .catch(() => {
        this.logger.error('Seeding failed!');
        process.exit(1);
      });
  }
}
