import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDetailPage } from './schedule-detail.page';

describe('ScheduleDetailPage', () => {
  let component: ScheduleDetailPage;
  let fixture: ComponentFixture<ScheduleDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
