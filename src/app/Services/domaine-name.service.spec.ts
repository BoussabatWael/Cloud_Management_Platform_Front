import { TestBed } from '@angular/core/testing';

import { DomaineNameService } from './domaine-name.service';

describe('DomaineNameService', () => {
  let service: DomaineNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomaineNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
