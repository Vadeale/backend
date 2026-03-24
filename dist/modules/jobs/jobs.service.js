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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const file_storage_service_1 = require("../storage/file-storage.service");
const JOB_LIFETIME_SECONDS = 10 * 24 * 3600;
let JobsService = class JobsService {
    constructor(storage) {
        this.storage = storage;
    }
    list(page, limit, category) {
        const now = Math.floor(Date.now() / 1000);
        const jobs = this.storage
            .readJobs()
            .jobs.filter((item) => {
            const createdAt = Number(item.created_at ?? item.time ?? 0);
            const expires = Number(item.expires ?? createdAt + JOB_LIFETIME_SECONDS);
            const status = String(item.status ?? 'active');
            const itemCategory = String(item.category ?? 'other');
            return status === 'active' && expires > now && (category === 'all' || category === itemCategory);
        })
            .reverse();
        const offset = Math.max(0, (page - 1) * limit);
        const chunk = jobs.slice(offset, offset + limit);
        return { success: true, count: chunk.length, total: jobs.length, jobs: chunk };
    }
    create(dto, file) {
        const createdAt = Math.floor(Date.now() / 1000);
        let imagePath = null;
        if (file) {
            const uploads = this.storage.ensureUploadsDir();
            const filename = `${Date.now()}-${(0, node_crypto_1.randomBytes)(5).toString('hex')}${(0, node_path_1.extname)(file.originalname || '.webp') || '.webp'}`;
            (0, node_fs_1.writeFileSync)((0, node_path_1.join)(uploads, filename), file.buffer);
            imagePath = `Uploads/${filename}`;
        }
        const token = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const deleteKey = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const envelope = this.storage.readJobs();
        envelope.jobs.push({
            text: dto.text,
            employer_email: dto.employer_email,
            email: dto.employer_email,
            public_contacts: dto.public_contacts,
            category: dto.category || 'other',
            created_at: createdAt,
            expires: createdAt + JOB_LIFETIME_SECONDS,
            token,
            delete_key: deleteKey,
            status: 'pending_payment',
            image: imagePath,
            viewers: [],
            responders: [],
            responses: 0,
        });
        this.storage.saveJobs(envelope);
        return { token };
    }
    activateByToken(token) {
        const envelope = this.storage.readJobs();
        envelope.jobs = envelope.jobs.map((item) => item.token === token ? { ...item, status: 'active', paid: true, created_at: Math.floor(Date.now() / 1000) } : item);
        this.storage.saveJobs(envelope);
    }
    activeCount() {
        return this.list(1, Number.MAX_SAFE_INTEGER, 'all').total;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map