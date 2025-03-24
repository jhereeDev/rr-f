import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedEntriesComponent } from './declined-entries.component';

describe('DeclinedEntriesComponent', () => {
  let component: DeclinedEntriesComponent;
  let fixture: ComponentFixture<DeclinedEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclinedEntriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclinedEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
