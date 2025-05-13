import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuizquierdaComponent } from './menuizquierda.component';

describe('MenuizquierdaComponent', () => {
  let component: MenuizquierdaComponent;
  let fixture: ComponentFixture<MenuizquierdaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuizquierdaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuizquierdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
