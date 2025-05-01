import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CheckDomainDto {
  @ApiProperty()
  @IsString()
  domain!: string

  @ApiProperty()
  @IsString()
  vercelProjectId!: string

  @ApiProperty()
  @IsString()
  vercelToken!: string

  @ApiProperty()
  @IsString()
  providerId?: string
}
