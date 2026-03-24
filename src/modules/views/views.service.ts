import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { FileStorageService } from '../storage/file-storage.service';

@Injectable()
export class ViewsService {
  constructor(private readonly storage: FileStorageService) {}

  count(token: string, action: 'view' | 'respond', remoteIp: string): { success: boolean; responses: number } {
    const viewerId = createHash('md5').update(remoteIp).digest('hex');
    const jobs = this.storage.readJobs();
    let responses = 0;
    jobs.jobs = jobs.jobs.map((item) => {
      if (item.token !== token) return item;
      const responders = Array.isArray(item.responders) ? item.responders : [];
      const viewers = Array.isArray(item.viewers) ? item.viewers : [];
      if (action === 'respond' && !responders.includes(viewerId)) responders.push(viewerId);
      if (action === 'view' && !viewers.includes(viewerId)) viewers.push(viewerId);
      responses = responders.length;
      return { ...item, responders, viewers, responses, unique_views: viewers.length };
    });
    this.storage.saveJobs(jobs);
    return { success: true, responses };
  }
}
