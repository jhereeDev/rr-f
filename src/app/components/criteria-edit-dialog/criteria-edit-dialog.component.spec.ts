import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaEditDialogComponent } from './criteria-edit-dialog.component';

describe('CriteriaEditDialogComponent', () => {
  let component: CriteriaEditDialogComponent;
  let fixture: ComponentFixture<CriteriaEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriteriaEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
