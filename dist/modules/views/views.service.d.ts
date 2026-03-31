import { JobsService } from '../jobs/jobs.service';
export declare class ViewsService {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    count(token: string, action: 'view' | 'respond', remoteIp: string): Promise<{
        success: boolean;
        responses: number;
    }>;
}
