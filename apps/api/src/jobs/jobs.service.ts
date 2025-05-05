import { Injectable } from '@nestjs/common'
import { CheckDomainDto } from './dto/check-domain.dto'
import { enqueue, JobType, JobData } from '@repo/queue'

@Injectable()
export class JobsService {
  constructor() {}

  async getJobs() {
    return true
  }

  async createPost(data: any) {
    // console.log('createPost', data)
    return data
  }

  async enqueueCheckDomain(data: CheckDomainDto) {
    const jobData = data as JobData[JobType.CheckDomain]
    return enqueue(JobType.CheckDomain, jobData, 60000)
  }
}
