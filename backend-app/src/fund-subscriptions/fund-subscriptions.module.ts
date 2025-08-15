import { Module } from '@nestjs/common';
import { FundSubscriptionsService } from './fund-subscriptions.service';
import { FundSubscriptionsController } from './fund-subscriptions.controller';

@Module({
  controllers: [FundSubscriptionsController],
  providers: [FundSubscriptionsService],
})
export class FundSubscriptionsModule {}
