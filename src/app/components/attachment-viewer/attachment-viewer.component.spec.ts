import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentViewerComponent } from './attachment-viewer.component';

describe('AttachmentViewerComponent', () => {
  let component: AttachmentViewerComponent;
  let fixture: ComponentFixture<AttachmentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
