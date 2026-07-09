import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomExternalPage } from './room-external.page';

describe('RoomExternalPage', () => {
  let component: RoomExternalPage;
  let fixture: ComponentFixture<RoomExternalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomExternalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
