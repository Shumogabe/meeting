import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomJoinPage } from './room-join.page';

describe('RoomJoinPage', () => {
  let component: RoomJoinPage;
  let fixture: ComponentFixture<RoomJoinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomJoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
