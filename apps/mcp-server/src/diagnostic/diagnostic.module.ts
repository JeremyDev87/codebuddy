import { Module } from '@nestjs/common';
import { DiagnosticLogService } from './diagnostic-log.service';
import { CodingBuddyConfigModule } from '../config/config.module';

@Module({
  imports: [CodingBuddyConfigModule],
  providers: [DiagnosticLogService],
  exports: [DiagnosticLogService],
})
export class DiagnosticModule {}
