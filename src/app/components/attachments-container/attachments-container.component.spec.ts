import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsContainerComponent } from './attachments-container.component';

describe('AttachmentsContainerComponent', () => {
  let component: AttachmentsContainerComponent;
  let fixture: ComponentFixture<AttachmentsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
