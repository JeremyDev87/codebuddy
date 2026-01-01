import { Module } from '@nestjs/common';
import { CustomService } from './custom.service';

@Module({
  providers: [CustomService],
  exports: [CustomService],
})
export class CustomModule {}
