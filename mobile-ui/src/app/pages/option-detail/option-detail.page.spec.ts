import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionDetailPage } from './option-detail.page';

describe('OptionDetailPage', () => {
  let component: OptionDetailPage;
  let fixture: ComponentFixture<OptionDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
