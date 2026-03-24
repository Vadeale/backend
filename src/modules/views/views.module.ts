import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [StorageModule],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
