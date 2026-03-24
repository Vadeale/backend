import { JobsService } from '../jobs/jobs.service';
export declare class StatsService {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    activeJobs(): number;
    visitorsToday(): number;
}
