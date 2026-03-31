import { FileStorageService } from '../storage/file-storage.service';
type JobRecord = Record<string, unknown>;
export declare class JobsService {
    private readonly storage;
    constructor(storage: FileStorageService);
    list(page: number, limit: number, category: string): {
        success: boolean;
        count: number;
        total: number;
        jobs: JobRecord[];
    };
    create(dto: {
        text: string;
        employer_email: string;
        public_contacts: string;
        category: string;
    }, file?: Express.Multer.File): {
        token: string;
    };
    attachPaymentId(token: string, paymentId: string): void;
    activateByToken(token: string): void;
    activateByPaymentId(paymentId: string): 'active' | 'not_found';
    activeCount(): number;
}
export {};
