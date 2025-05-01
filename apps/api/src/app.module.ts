import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JobsModule } from './jobs/jobs.module'
import { AppController } from './app.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), JobsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
