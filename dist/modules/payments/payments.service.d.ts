import { JobsService } from '../jobs/jobs.service';
export declare class PaymentsService {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    createPayment(payload: {
        text: string;
        email: string;
        category: string;
        public_contacts: string;
        token: string;
    }): Promise<{
        redirect_url: string;
        payment_id: string;
    }>;
    processWebhook(payload: {
        event?: string;
        object?: {
            metadata?: {
                token?: string;
            };
        };
    }): Promise<{
        status: string;
    }>;
    signDebugPayload(raw: string): string;
}
