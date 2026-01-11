import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { ContextDocumentService } from './context-document.service';
import { ChecklistModule } from '../checklist/checklist.module';
import { CodingBuddyConfigModule } from '../config/config.module';

@Module({
  imports: [ChecklistModule, CodingBuddyConfigModule],
  providers: [ContextService, ContextDocumentService],
  exports: [ContextService, ContextDocumentService],
})
export class ContextModule {}
