import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuizquierdaconfigComponent } from './menuizquierdaconfig.component';

describe('MenuizquierdaconfigComponent', () => {
  let component: MenuizquierdaconfigComponent;
  let fixture: ComponentFixture<MenuizquierdaconfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuizquierdaconfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuizquierdaconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
