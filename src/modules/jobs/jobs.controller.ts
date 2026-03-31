import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { JobsService } from './jobs.service';

class ListJobsQuery {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  category?: string;
}

class CreateJobBody {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  text!: string;

  @IsEmail()
  employer_email!: string;

  @IsString()
  @IsNotEmpty()
  public_contacts!: string;

  @IsIn(['video', 'design', 'marketing', 'chats', 'sites', 'social', 'support', 'other'])
  category!: string;
}

@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async list(@Query() query: ListJobsQuery) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const category = String(query.category ?? 'all');
    return this.jobsService.list(page, limit, category);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() body: CreateJobBody, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.create(body, file);
  }
}
