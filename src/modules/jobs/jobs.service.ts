import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { extname, join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { FileStorageService } from '../storage/file-storage.service';

type JobRecord = Record<string, unknown>;

const JOB_LIFETIME_SECONDS = 10 * 24 * 3600;

@Injectable()
export class JobsService {
  constructor(private readonly storage: FileStorageService) {}

  list(page: number, limit: number, category: string): { success: boolean; count: number; total: number; jobs: JobRecord[] } {
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

  create(dto: { text: string; employer_email: string; public_contacts: string; category: string }, file?: Express.Multer.File): { token: string } {
    const createdAt = Math.floor(Date.now() / 1000);
    let imagePath: string | null = null;
    if (file) {
      const uploads = this.storage.ensureUploadsDir();
      const filename = `${Date.now()}-${randomBytes(5).toString('hex')}${extname(file.originalname || '.webp') || '.webp'}`;
      writeFileSync(join(uploads, filename), file.buffer);
      imagePath = `Uploads/${filename}`;
    }

    const token = randomBytes(16).toString('hex');
    const deleteKey = randomBytes(16).toString('hex');
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

  attachPaymentId(token: string, paymentId: string): void {
    const envelope = this.storage.readJobs();
    envelope.jobs = envelope.jobs.map((item) => (item.token === token ? { ...item, payment_id: paymentId } : item));
    this.storage.saveJobs(envelope);
  }

  activateByToken(token: string): void {
    const envelope = this.storage.readJobs();
    envelope.jobs = envelope.jobs.map((item) =>
      item.token === token ? { ...item, status: 'active', paid: true, created_at: Math.floor(Date.now() / 1000) } : item,
    );
    this.storage.saveJobs(envelope);
  }

  activateByPaymentId(paymentId: string): 'active' | 'not_found' {
    const envelope = this.storage.readJobs();
    let found = false;
    envelope.jobs = envelope.jobs.map((item) => {
      if (item.payment_id !== paymentId) {
        return item;
      }
      found = true;
      if (item.status === 'active') {
        return item;
      }
      return { ...item, status: 'active', paid: true, created_at: Math.floor(Date.now() / 1000) };
    });
    if (!found) {
      return 'not_found';
    }
    this.storage.saveJobs(envelope);
    return 'active';
  }

  activeCount(): number {
    return this.list(1, Number.MAX_SAFE_INTEGER, 'all').total;
  }
}
