import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigDiffService } from './config-diff.service';

@Module({
  providers: [ConfigService, ConfigDiffService],
  exports: [ConfigService, ConfigDiffService],
})
export class CodingBuddyConfigModule {}
