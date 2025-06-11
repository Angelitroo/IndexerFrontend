import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificacionespopoverComponent } from './notificacionespopover.component';

describe('NotificacionespopoverComponent', () => {
  let component: NotificacionespopoverComponent;
  let fixture: ComponentFixture<NotificacionespopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotificacionespopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionespopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
