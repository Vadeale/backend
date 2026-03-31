"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const jobs_service_1 = require("../jobs/jobs.service");
let PaymentsService = class PaymentsService {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async createPayment(payload) {
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
                'Idempotence-Key': (0, node_crypto_1.randomUUID)(),
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to create YooKassa payment: HTTP ${response.status}`);
        }
        const payment = (await response.json());
        const paymentId = payment.id;
        const confirmationUrl = payment.confirmation?.confirmation_url;
        if (!paymentId || !confirmationUrl) {
            throw new Error('YooKassa response does not include payment id or confirmation url');
        }
        await this.jobsService.attachPaymentId(payload.token, paymentId);
        return { redirect_url: confirmationUrl, payment_id: paymentId };
    }
    async processWebhook(payload) {
        if (payload.event === 'payment.succeeded' && payload.object?.status === 'succeeded') {
            if (payload.object.id) {
                await this.jobsService.activateByPaymentId(payload.object.id);
            }
            else if (payload.object.metadata?.token) {
                await this.jobsService.activateByToken(payload.object.metadata.token);
            }
        }
        return { status: 'success' };
    }
    signDebugPayload(raw) {
        return (0, node_crypto_1.createHash)('sha256').update(raw).digest('hex');
    }
    async confirmPayment(paymentId) {
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
    async fetchPaymentStatus(paymentId) {
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
        const payment = (await response.json());
        return payment.status;
    }
    getAuthHeader(shopId, secretKey) {
        return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map