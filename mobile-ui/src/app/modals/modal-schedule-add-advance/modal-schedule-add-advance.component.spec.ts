import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalScheduleAddAdvanceComponent } from './modal-schedule-add-advance.component';

describe('ModalScheduleAddAdvanceComponent', () => {
  let component: ModalScheduleAddAdvanceComponent;
  let fixture: ComponentFixture<ModalScheduleAddAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalScheduleAddAdvanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalScheduleAddAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
