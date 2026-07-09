import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedPage } from './deleted.page';

describe('DeletedPage', () => {
  let component: DeletedPage;
  let fixture: ComponentFixture<DeletedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
