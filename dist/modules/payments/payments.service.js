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
        const paymentId = (0, node_crypto_1.randomUUID)();
        const redirect_url = `${process.env.PAYMENT_RETURN_URL ?? 'https://zadashka.ru/'}?payment_id=${paymentId}`;
        return { redirect_url, payment_id: paymentId };
    }
    async processWebhook(payload) {
        if (payload.event === 'payment.succeeded') {
            const token = payload.object?.metadata?.token;
            if (token) {
                this.jobsService.activateByToken(token);
            }
        }
        return { status: 'success' };
    }
    signDebugPayload(raw) {
        return (0, node_crypto_1.createHash)('sha256').update(raw).digest('hex');
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map