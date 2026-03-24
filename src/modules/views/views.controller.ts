import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ViewsService } from './views.service';

@Controller('api/views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get()
  count(@Query('token') token: string, @Query('action') action: 'view' | 'respond' = 'view', @Req() request: Request) {
    return this.viewsService.count(token, action, request.ip ?? request.socket.remoteAddress ?? '0.0.0.0');
  }
}
