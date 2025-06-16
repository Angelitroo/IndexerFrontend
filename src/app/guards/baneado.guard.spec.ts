import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { baneadoGuard } from './baneado.guard';

describe('baneadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => baneadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
