import { TestBed } from '@angular/core/testing';

import { RewardpointsService } from './rewardpoints.service';

describe('RewardpointsService', () => {
  let service: RewardpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
