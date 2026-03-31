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
exports.PendingJob = void 0;
const typeorm_1 = require("typeorm");
let PendingJob = class PendingJob {
};
exports.PendingJob = PendingJob;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PendingJob.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, unique: true }),
    __metadata("design:type", String)
], PendingJob.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_id', type: 'varchar', length: 64, nullable: true, unique: true }),
    __metadata("design:type", Object)
], PendingJob.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PendingJob.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employer_email', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PendingJob.prototype, "employerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_contacts', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PendingJob.prototype, "publicContacts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, default: 'other' }),
    __metadata("design:type", String)
], PendingJob.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, default: 'pending' }),
    __metadata("design:type", String)
], PendingJob.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], PendingJob.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], PendingJob.prototype, "createdAt", void 0);
exports.PendingJob = PendingJob = __decorate([
    (0, typeorm_1.Entity)({ name: 'pending_jobs' })
], PendingJob);
//# sourceMappingURL=pending-job.entity.js.map