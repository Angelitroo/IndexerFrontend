import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuizquierdaperfilComponent } from './menuizquierdaperfil.component';

describe('MenuizquierdaperfilComponent', () => {
  let component: MenuizquierdaperfilComponent;
  let fixture: ComponentFixture<MenuizquierdaperfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuizquierdaperfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuizquierdaperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
