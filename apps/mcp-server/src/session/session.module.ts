import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { CodingBuddyConfigModule } from '../config/config.module';

@Module({
  imports: [CodingBuddyConfigModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
