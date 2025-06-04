import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearalertapopoverComponent } from './crearalertapopover.component';

describe('CrearalertapopoverComponent', () => {
  let component: CrearalertapopoverComponent;
  let fixture: ComponentFixture<CrearalertapopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearalertapopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearalertapopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
