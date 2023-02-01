import { TestBed } from '@angular/core/testing';

import { CoreModulesService } from './core-modules.service';

describe('CoreModulesService', () => {
  let service: CoreModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
