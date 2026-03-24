import type { Request } from 'express';
import { PaymentsService } from './payments.service';
declare class CreatePaymentBody {
    text: string;
    email: string;
    category: string;
    public_contacts: string;
    token: string;
}
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(body: CreatePaymentBody): Promise<{
        redirect_url: string;
        payment_id: string;
    }>;
    webhook(body: {
        event?: string;
        object?: {
            metadata?: {
                token?: string;
            };
        };
    }, request: Request): Promise<{
        status: string;
    }>;
}
export {};
