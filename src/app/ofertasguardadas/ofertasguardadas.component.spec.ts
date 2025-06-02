import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfertasguardadasComponent } from './ofertasguardadas.component';

describe('OfertasguardadasComponent', () => {
  let component: OfertasguardadasComponent;
  let fixture: ComponentFixture<OfertasguardadasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OfertasguardadasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertasguardadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
