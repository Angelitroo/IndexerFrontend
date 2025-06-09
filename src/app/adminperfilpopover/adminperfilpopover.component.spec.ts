import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminperfilpopoverComponent } from './adminperfilpopover.component';

describe('AdminperfilpopoverComponent', () => {
  let component: AdminperfilpopoverComponent;
  let fixture: ComponentFixture<AdminperfilpopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminperfilpopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminperfilpopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
