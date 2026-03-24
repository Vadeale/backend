import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    activeJobs(): {
        value: number;
    };
    visitorsToday(): {
        value: number;
    };
}
