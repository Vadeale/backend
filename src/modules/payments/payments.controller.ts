import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';

class CreatePaymentBody {
  @IsString()
  @IsNotEmpty()
  text!: string;
  @IsString()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @IsNotEmpty()
  category!: string;
  @IsString()
  @IsNotEmpty()
  public_contacts!: string;
  @IsString()
  @IsNotEmpty()
  token!: string;
}

class ConfirmPaymentQuery {
  @IsString()
  @IsNotEmpty()
  payment_id!: string;
}

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() body: CreatePaymentBody) {
    return this.paymentsService.createPayment(body);
  }

  @Post('webhook')
  async webhook(@Body() body: { event?: string; object?: { metadata?: { token?: string } } }, @Req() request: Request) {
    this.paymentsService.signDebugPayload(JSON.stringify(request.body));
    return this.paymentsService.processWebhook(body);
  }

  @Get('confirm')
  async confirm(@Query() query: ConfirmPaymentQuery) {
    return this.paymentsService.confirmPayment(query.payment_id);
  }
}
