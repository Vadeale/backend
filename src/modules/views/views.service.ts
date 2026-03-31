import { Injectable } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class ViewsService {
  constructor(private readonly jobsService: JobsService) {}

  async count(token: string, action: 'view' | 'respond', remoteIp: string): Promise<{ success: boolean; responses: number }> {
    const _unusedIp = remoteIp;
    if (action === 'respond') {
      const responses = await this.jobsService.incrementResponses(token);
      return { success: true, responses };
    }
    const responses = await this.jobsService.getResponses(token);
    return { success: true, responses };
  }
}
