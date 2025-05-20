import { TestBed } from '@angular/core/testing';

import { RewardEntryDialogService } from './reward-entry-dialog.service';

describe('RewardEntryDialogService', () => {
  let service: RewardEntryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardEntryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
