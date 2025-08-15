import { Test, TestingModule } from '@nestjs/testing';
import { FundSubscriptionsController } from './fund-subscriptions.controller';
import { FundSubscriptionsService } from './fund-subscriptions.service';

describe('FundSubscriptionsController', () => {
  let controller: FundSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundSubscriptionsController],
      providers: [FundSubscriptionsService],
    }).compile();

    controller = module.get<FundSubscriptionsController>(FundSubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
