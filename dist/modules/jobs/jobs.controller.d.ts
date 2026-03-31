import { JobsService } from './jobs.service';
declare class ListJobsQuery {
    page?: number;
    limit?: number;
    category?: string;
}
declare class CreateJobBody {
    text: string;
    employer_email: string;
    public_contacts: string;
    category: string;
}
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    list(query: ListJobsQuery): Promise<{
        success: boolean;
        count: number;
        total: number;
        jobs: {
            [x: string]: unknown;
        }[];
    }>;
    create(body: CreateJobBody, file?: Express.Multer.File): Promise<{
        token: string;
    }>;
}
export {};
