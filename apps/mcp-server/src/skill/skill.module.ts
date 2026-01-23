import { Module } from '@nestjs/common';
import { SkillRecommendationService } from './skill-recommendation.service';

@Module({
  providers: [SkillRecommendationService],
  exports: [SkillRecommendationService],
})
export class SkillModule {}
