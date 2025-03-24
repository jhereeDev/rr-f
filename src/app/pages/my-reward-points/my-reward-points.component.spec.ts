import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRewardPointsComponent } from './my-reward-points.component';

describe('MyRewardPointsComponent', () => {
  let component: MyRewardPointsComponent;
  let fixture: ComponentFixture<MyRewardPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRewardPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRewardPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
