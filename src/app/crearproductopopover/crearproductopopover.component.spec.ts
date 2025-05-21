import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearproductopopoverComponent } from './crearproductopopover.component';

describe('CrearproductopopoverComponent', () => {
  let component: CrearproductopopoverComponent;
  let fixture: ComponentFixture<CrearproductopopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearproductopopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearproductopopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
