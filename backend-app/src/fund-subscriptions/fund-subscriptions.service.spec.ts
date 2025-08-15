import { Test, TestingModule } from '@nestjs/testing';
import { FundSubscriptionsService } from './fund-subscriptions.service';

describe('FundSubscriptionsService', () => {
  let service: FundSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundSubscriptionsService],
    }).compile();

    service = module.get<FundSubscriptionsService>(FundSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
