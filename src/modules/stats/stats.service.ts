import { Injectable } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class StatsService {
  constructor(private readonly jobsService: JobsService) {}

  activeJobs(): number {
    return this.jobsService.activeCount();
  }

  visitorsToday(): number {
    const min = 100;
    const max = 300;
    const progress = (new Date().getHours() * 3600 + new Date().getMinutes() * 60) / (24 * 3600);
    return Math.round(min + (max - min) * progress);
  }
}
