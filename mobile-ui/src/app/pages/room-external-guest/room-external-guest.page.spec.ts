import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomExternalGuestPage } from './room-external-guest.page';

describe('RoomExternalGuestPage', () => {
  let component: RoomExternalGuestPage;
  let fixture: ComponentFixture<RoomExternalGuestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomExternalGuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
