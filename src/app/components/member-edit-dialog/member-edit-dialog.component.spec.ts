import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEditDialogComponent } from './member-edit-dialog.component';

describe('MemberEditDialogComponent', () => {
  let component: MemberEditDialogComponent;
  let fixture: ComponentFixture<MemberEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
