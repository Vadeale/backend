import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [JobsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
