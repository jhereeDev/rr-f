import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerApprovalComponent } from './manager-approval.component';

describe('ManagerApprovalComponent', () => {
  let component: ManagerApprovalComponent;
  let fixture: ComponentFixture<ManagerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
