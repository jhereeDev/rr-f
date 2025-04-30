import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMappingDialogComponent } from './member-mapping-dialog.component';

describe('MemberMappingDialogComponent', () => {
  let component: MemberMappingDialogComponent;
  let fixture: ComponentFixture<MemberMappingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberMappingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
