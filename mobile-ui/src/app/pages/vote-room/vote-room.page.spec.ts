import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteRoomPage } from './vote-room.page';

describe('VoteRoomPage', () => {
  let component: VoteRoomPage;
  let fixture: ComponentFixture<VoteRoomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
