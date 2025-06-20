import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaneladminComponent } from './paneladmin.component';

describe('PaneladminComponent', () => {
  let component: PaneladminComponent;
  let fixture: ComponentFixture<PaneladminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PaneladminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaneladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
