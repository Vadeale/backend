import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';
import { extname, join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { FileStorageService } from '../storage/file-storage.service';
import { Job } from './job.entity';
import { PendingJob } from './pending-job.entity';

type JobRecord = Record<string, unknown>;

const JOB_LIFETIME_SECONDS = 10 * 24 * 3600;

@Injectable()
export class JobsService {
  constructor(
    private readonly storage: FileStorageService,
    private readonly dataSource: DataSource,
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    @InjectRepository(PendingJob) private readonly pendingJobsRepository: Repository<PendingJob>,
  ) {}

  async list(page: number, limit: number, category: string): Promise<{ success: boolean; count: number; total: number; jobs: JobRecord[] }> {
    const offset = Math.max(0, (page - 1) * limit);
    const where = {
      status: 'active',
      expiresAt: MoreThan(new Date()),
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

  async create(
    dto: { text: string; employer_email: string; public_contacts: string; category: string },
    file?: Express.Multer.File,
  ): Promise<{ token: string }> {
    let imagePath: string | null = null;
    if (file) {
      const uploads = this.storage.ensureUploadsDir();
      const filename = `${Date.now()}-${randomBytes(5).toString('hex')}${extname(file.originalname || '.webp') || '.webp'}`;
      writeFileSync(join(uploads, filename), file.buffer);
      imagePath = `/storage/uploads/${filename}`;
    }

    const token = randomBytes(16).toString('hex');
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

  async attachPaymentId(token: string, paymentId: string): Promise<void> {
    await this.pendingJobsRepository.update({ token }, { paymentId });
  }

  async activateByToken(token: string): Promise<'active' | 'not_found'> {
    const pending = await this.pendingJobsRepository.findOne({ where: { token } });
    if (!pending) {
      return 'not_found';
    }
    return this.activatePending(pending);
  }

  async activateByPaymentId(paymentId: string): Promise<'active' | 'not_found'> {
    const pending = await this.pendingJobsRepository.findOne({ where: { paymentId } });
    if (!pending) {
      return 'not_found';
    }
    return this.activatePending(pending);
  }

  async activeCount(): Promise<number> {
    return this.jobsRepository.count({
      where: { status: 'active', expiresAt: MoreThan(new Date()) },
    });
  }

  async incrementResponses(token: string): Promise<number> {
    const row = await this.jobsRepository.findOne({ where: { token } });
    if (!row) {
      return 0;
    }
    row.responses += 1;
    await this.jobsRepository.save(row);
    return row.responses;
  }

  async getResponses(token: string): Promise<number> {
    const row = await this.jobsRepository.findOne({ where: { token } });
    return row?.responses ?? 0;
  }

  private async activatePending(pending: PendingJob): Promise<'active' | 'not_found'> {
    await this.dataSource.transaction(async (manager) => {
      const pendingRepo = manager.getRepository(PendingJob);
      const jobsRepo = manager.getRepository(Job);
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

  private normalizeImagePath(value: string | null): string | null {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/storage/uploads/')) return value;
    if (value.startsWith('Uploads/')) return `/storage/uploads/${value.slice('Uploads/'.length)}`;
    if (value.startsWith('uploads/')) return `/storage/uploads/${value.slice('uploads/'.length)}`;
    return value.startsWith('/') ? value : `/storage/uploads/${value}`;
  }
}
