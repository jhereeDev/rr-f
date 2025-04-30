import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpsLeaderboardComponent } from './cbps-leaderboard.component';

describe('CbpsLeaderboardComponent', () => {
  let component: CbpsLeaderboardComponent;
  let fixture: ComponentFixture<CbpsLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbpsLeaderboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CbpsLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
