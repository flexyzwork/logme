import { Body, Controller, Get, Post } from '@nestjs/common'
import { JobsService } from './jobs.service'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('check-domain')
  async getJobs() {
    return this.jobsService.getJobs()
  }

  @Post('check-domain')
  async checkDomain(@Body() body: any) {
    console.log('domain:', body.domain)
    return this.jobsService.enqueueCheckDomain(body)
  }
}
