import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [JobsModule],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
