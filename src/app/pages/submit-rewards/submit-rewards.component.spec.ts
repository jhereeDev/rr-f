import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRewardsComponent } from './submit-rewards.component';

describe('SubmitRewardsComponent', () => {
  let component: SubmitRewardsComponent;
  let fixture: ComponentFixture<SubmitRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitRewardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
