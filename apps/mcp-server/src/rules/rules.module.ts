import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CustomModule } from '../custom';

@Module({
  imports: [CustomModule],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
