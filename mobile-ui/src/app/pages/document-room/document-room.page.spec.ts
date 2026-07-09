import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRoomPage } from './document-room.page';

describe('DocumentRoomPage', () => {
  let component: DocumentRoomPage;
  let fixture: ComponentFixture<DocumentRoomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
