import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly jobsService: JobsService) {}

  async createPayment(payload: {
    text: string;
    email: string;
    category: string;
    public_contacts: string;
    token: string;
  }): Promise<{ redirect_url: string; payment_id: string }> {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) {
      throw new Error('YOOKASSA credentials are not configured');
    }

    const paymentId = randomUUID();
    this.jobsService.attachPaymentId(payload.token, paymentId);
    const redirect_url = `${process.env.PAYMENT_RETURN_URL ?? 'https://zadashka.ru/payment-result'}?payment_id=${paymentId}`;
    return { redirect_url, payment_id: paymentId };
  }

  async processWebhook(payload: { event?: string; object?: { metadata?: { token?: string } } }): Promise<{ status: string }> {
    if (payload.event === 'payment.succeeded') {
      const token = payload.object?.metadata?.token;
      if (token) {
        this.jobsService.activateByToken(token);
      }
    }
    return { status: 'success' };
  }

  signDebugPayload(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  confirmPayment(paymentId: string): { status: 'active' | 'not_found' } {
    const status = this.jobsService.activateByPaymentId(paymentId);
    return { status };
  }
}
