import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardPointsModalComponent } from './reward-points-modal.component';

describe('RewardPointsModalComponent', () => {
  let component: RewardPointsModalComponent;
  let fixture: ComponentFixture<RewardPointsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardPointsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardPointsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
