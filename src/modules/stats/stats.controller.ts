import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('active-jobs')
  activeJobs() {
    return { value: this.statsService.activeJobs() };
  }

  @Get('visitors-today')
  visitorsToday() {
    return { value: this.statsService.visitorsToday() };
  }
}
