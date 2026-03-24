import { Body, Controller, Post, Req } from '@nestjs/common';
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

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() body: CreatePaymentBody) {
    return this.paymentsService.createPayment(body);
  }

  @Post('webhook')
  webhook(@Body() body: { event?: string; object?: { metadata?: { token?: string } } }, @Req() request: Request) {
    this.paymentsService.signDebugPayload(JSON.stringify(request.body));
    return this.paymentsService.processWebhook(body);
  }
}
