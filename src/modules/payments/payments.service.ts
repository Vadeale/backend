import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { JobsService } from '../jobs/jobs.service';

type YookassaPaymentResponse = {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
  metadata?: { token?: string };
};

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

    const returnUrl = process.env.PAYMENT_RETURN_URL ?? 'https://zadashka.ru/payment-result';
    const body = {
      amount: { value: '10.00', currency: 'RUB' },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description: `Размещение объявления (${payload.category})`,
      metadata: { token: payload.token },
    };

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(shopId, secretKey),
        'Content-Type': 'application/json',
        'Idempotence-Key': randomUUID(),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to create YooKassa payment: HTTP ${response.status}`);
    }
    const payment = (await response.json()) as YookassaPaymentResponse;
    const paymentId = payment.id;
    const confirmationUrl = payment.confirmation?.confirmation_url;
    if (!paymentId || !confirmationUrl) {
      throw new Error('YooKassa response does not include payment id or confirmation url');
    }
    await this.jobsService.attachPaymentId(payload.token, paymentId);
    return { redirect_url: confirmationUrl, payment_id: paymentId };
  }

  async processWebhook(payload: {
    event?: string;
    object?: { id?: string; status?: string; metadata?: { token?: string } };
  }): Promise<{ status: string }> {
    if (payload.event === 'payment.succeeded' && payload.object?.status === 'succeeded') {
      if (payload.object.id) {
        await this.jobsService.activateByPaymentId(payload.object.id);
      } else if (payload.object.metadata?.token) {
        await this.jobsService.activateByToken(payload.object.metadata.token);
      }
    }
    return { status: 'success' };
  }

  signDebugPayload(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  async confirmPayment(paymentId: string): Promise<{ status: 'active' | 'waiting_payment' | 'not_found' }> {
    const remoteStatus = await this.fetchPaymentStatus(paymentId);
    if (remoteStatus === 'not_found') {
      return { status: 'not_found' };
    }
    if (remoteStatus !== 'succeeded') {
      return { status: 'waiting_payment' };
    }
    const status = await this.jobsService.activateByPaymentId(paymentId);
    return { status };
  }

  private async fetchPaymentStatus(paymentId: string): Promise<string | 'not_found'> {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) {
      throw new Error('YOOKASSA credentials are not configured');
    }
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: { Authorization: this.getAuthHeader(shopId, secretKey) },
    });
    if (response.status === 404) {
      return 'not_found';
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch YooKassa payment status: HTTP ${response.status}`);
    }
    const payment = (await response.json()) as YookassaPaymentResponse;
    return payment.status;
  }

  private getAuthHeader(shopId: string, secretKey: string): string {
    return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`;
  }
}
