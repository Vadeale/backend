import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type JobsEnvelope = { jobs: Record<string, unknown>[] };

@Injectable()
export class FileStorageService {
  private readonly root = process.env.STORAGE_ROOT ?? join(process.cwd(), '..');
  private readonly jobsPath = join(this.root, 'jobs.json');
  private readonly viewsPath = join(this.root, 'views.json');
  private readonly uploadsPath = join(this.root, 'Uploads');

  readJobs(): JobsEnvelope {
    if (!existsSync(this.jobsPath)) {
      return { jobs: [] };
    }
    const parsed = JSON.parse(readFileSync(this.jobsPath, 'utf-8')) as unknown;
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as JobsEnvelope).jobs)) {
      return parsed as JobsEnvelope;
    }
    if (Array.isArray(parsed)) {
      return { jobs: parsed as Record<string, unknown>[] };
    }
    return { jobs: [] };
  }

  saveJobs(payload: JobsEnvelope): void {
    writeFileSync(this.jobsPath, JSON.stringify(payload, null, 2), { encoding: 'utf-8' });
  }

  readViews(): Record<string, number> {
    if (!existsSync(this.viewsPath)) {
      return {};
    }
    return JSON.parse(readFileSync(this.viewsPath, 'utf-8')) as Record<string, number>;
  }

  saveViews(payload: Record<string, number>): void {
    writeFileSync(this.viewsPath, JSON.stringify(payload, null, 2), { encoding: 'utf-8' });
  }

  ensureUploadsDir(): string {
    if (!existsSync(this.uploadsPath)) {
      mkdirSync(this.uploadsPath, { recursive: true });
    }
    return this.uploadsPath;
  }
}
