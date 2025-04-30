import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaAddDialogComponent } from './criteria-add-dialog.component';

describe('CriteriaAddDialogComponent', () => {
  let component: CriteriaAddDialogComponent;
  let fixture: ComponentFixture<CriteriaAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriteriaAddDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
