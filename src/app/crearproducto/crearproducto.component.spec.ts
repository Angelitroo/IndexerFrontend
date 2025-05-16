import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearproductoComponent } from './crearproducto.component';

describe('CrearproductoComponent', () => {
  let component: CrearproductoComponent;
  let fixture: ComponentFixture<CrearproductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearproductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
