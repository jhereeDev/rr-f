import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberConfirmDialogComponent } from './member-confirm-dialog.component';

describe('MemberConfirmDialogComponent', () => {
  let component: MemberConfirmDialogComponent;
  let fixture: ComponentFixture<MemberConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberConfirmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
