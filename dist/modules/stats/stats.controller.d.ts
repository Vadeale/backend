import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    activeJobs(): Promise<{
        value: number;
    }>;
    visitorsToday(): {
        value: number;
    };
}
