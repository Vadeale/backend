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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const typeorm_2 = require("typeorm");
const file_storage_service_1 = require("../storage/file-storage.service");
const job_entity_1 = require("./job.entity");
const pending_job_entity_1 = require("./pending-job.entity");
const JOB_LIFETIME_SECONDS = 10 * 24 * 3600;
let JobsService = class JobsService {
    constructor(storage, dataSource, jobsRepository, pendingJobsRepository) {
        this.storage = storage;
        this.dataSource = dataSource;
        this.jobsRepository = jobsRepository;
        this.pendingJobsRepository = pendingJobsRepository;
    }
    async list(page, limit, category) {
        const offset = Math.max(0, (page - 1) * limit);
        const where = {
            status: 'active',
            expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            ...(category === 'all' ? {} : { category }),
        };
        const [rows, total] = await this.jobsRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const jobs = rows.map((item) => ({
            token: item.token,
            text: item.text,
            category: item.category,
            public_contacts: item.publicContacts,
            employer_email: item.employerEmail,
            email: item.employerEmail,
            created_at: Math.floor(item.createdAt.getTime() / 1000),
            expires: Math.floor(item.expiresAt.getTime() / 1000),
            status: item.status,
            image: this.normalizeImagePath(item.image),
            responses: item.responses,
        }));
        return { success: true, count: jobs.length, total, jobs };
    }
    async create(dto, file) {
        let imagePath = null;
        if (file) {
            const uploads = this.storage.ensureUploadsDir();
            const filename = `${Date.now()}-${(0, node_crypto_1.randomBytes)(5).toString('hex')}${(0, node_path_1.extname)(file.originalname || '.webp') || '.webp'}`;
            (0, node_fs_1.writeFileSync)((0, node_path_1.join)(uploads, filename), file.buffer);
            imagePath = `/storage/uploads/${filename}`;
        }
        const token = (0, node_crypto_1.randomBytes)(16).toString('hex');
        await this.pendingJobsRepository.insert({
            text: dto.text,
            employerEmail: dto.employer_email,
            publicContacts: dto.public_contacts,
            category: dto.category ?? 'other',
            token,
            status: 'pending',
            image: imagePath,
        });
        return { token };
    }
    async attachPaymentId(token, paymentId) {
        await this.pendingJobsRepository.update({ token }, { paymentId });
    }
    async activateByToken(token) {
        const pending = await this.pendingJobsRepository.findOne({ where: { token } });
        if (!pending) {
            return 'not_found';
        }
        return this.activatePending(pending);
    }
    async activateByPaymentId(paymentId) {
        const pending = await this.pendingJobsRepository.findOne({ where: { paymentId } });
        if (!pending) {
            return 'not_found';
        }
        return this.activatePending(pending);
    }
    async activeCount() {
        return this.jobsRepository.count({
            where: { status: 'active', expiresAt: (0, typeorm_2.MoreThan)(new Date()) },
        });
    }
    async incrementResponses(token) {
        const row = await this.jobsRepository.findOne({ where: { token } });
        if (!row) {
            return 0;
        }
        row.responses += 1;
        await this.jobsRepository.save(row);
        return row.responses;
    }
    async getResponses(token) {
        const row = await this.jobsRepository.findOne({ where: { token } });
        return row?.responses ?? 0;
    }
    async activatePending(pending) {
        await this.dataSource.transaction(async (manager) => {
            const pendingRepo = manager.getRepository(pending_job_entity_1.PendingJob);
            const jobsRepo = manager.getRepository(job_entity_1.Job);
            const fresh = await pendingRepo.findOne({ where: { id: pending.id } });
            if (!fresh) {
                return;
            }
            if (fresh.status === 'processed') {
                return;
            }
            const existing = await jobsRepo.findOne({ where: { token: fresh.token } });
            if (!existing) {
                await jobsRepo.insert({
                    token: fresh.token,
                    text: fresh.text,
                    employerEmail: fresh.employerEmail,
                    publicContacts: fresh.publicContacts,
                    category: fresh.category,
                    status: 'active',
                    responses: 0,
                    image: fresh.image,
                    expiresAt: new Date(Date.now() + JOB_LIFETIME_SECONDS * 1000),
                });
            }
            fresh.status = 'processed';
            await pendingRepo.save(fresh);
        });
        return 'active';
    }
    normalizeImagePath(value) {
        if (!value)
            return null;
        if (value.startsWith('http://') || value.startsWith('https://'))
            return value;
        if (value.startsWith('/storage/uploads/'))
            return value;
        if (value.startsWith('/Uploads/'))
            return `/storage/uploads/${value.slice('/Uploads/'.length)}`;
        if (value.startsWith('/uploads/'))
            return `/storage/uploads/${value.slice('/uploads/'.length)}`;
        if (value.startsWith('Uploads/'))
            return `/storage/uploads/${value.slice('Uploads/'.length)}`;
        if (value.startsWith('uploads/'))
            return `/storage/uploads/${value.slice('uploads/'.length)}`;
        return value.startsWith('/') ? value : `/storage/uploads/${value}`;
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(3, (0, typeorm_1.InjectRepository)(pending_job_entity_1.PendingJob)),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService,
        typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map