import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RewardDetailService } from './reward-detail.service';
import { ToastService } from './toast.service';

describe('RewardDetailService', () => {
  let service: RewardDetailService;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        RewardDetailService,
        { provide: ToastService, useValue: spy }
      ]
    });
    service = TestBed.inject(RewardDetailService);
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
