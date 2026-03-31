import { DataSource, Repository } from 'typeorm';
import { FileStorageService } from '../storage/file-storage.service';
import { Job } from './job.entity';
import { PendingJob } from './pending-job.entity';
type JobRecord = Record<string, unknown>;
export declare class JobsService {
    private readonly storage;
    private readonly dataSource;
    private readonly jobsRepository;
    private readonly pendingJobsRepository;
    constructor(storage: FileStorageService, dataSource: DataSource, jobsRepository: Repository<Job>, pendingJobsRepository: Repository<PendingJob>);
    list(page: number, limit: number, category: string): Promise<{
        success: boolean;
        count: number;
        total: number;
        jobs: JobRecord[];
    }>;
    create(dto: {
        text: string;
        employer_email: string;
        public_contacts: string;
        category: string;
    }, file?: Express.Multer.File): Promise<{
        token: string;
    }>;
    attachPaymentId(token: string, paymentId: string): Promise<void>;
    activateByToken(token: string): Promise<'active' | 'not_found'>;
    activateByPaymentId(paymentId: string): Promise<'active' | 'not_found'>;
    activeCount(): Promise<number>;
    incrementResponses(token: string): Promise<number>;
    getResponses(token: string): Promise<number>;
    private activatePending;
}
export {};
